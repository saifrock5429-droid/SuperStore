import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';

const categories = ["Ladies Watch", "Mens Watch", "Ladies Sunglasses", "Mens Sunglasses", "Belts", "All Bags", "Shoes"];


const MAX_IMAGE_SIZE = 10 * 1024 * 1024; 
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; 


const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 1920; 
        const MAX_HEIGHT = 1080;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Canvas to Blob failed"));
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const AddProduct = ({ setProducts }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: categories[0],
    name: '',
    price: '',
    originalPrice: '',
  });

  const [files, setFiles] = useState({
    image: null,
    galleryImg1: null,
    galleryImg2: null,
    galleryImg3: null,
    galleryImg4: null,
    galleryVideo: null
  });

  const [previewUrls, setPreviewUrls] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name } = e.target;
    let file = e.target.files[0];

    if (file) {
      const isVideo = file.type.startsWith('video/');
      const limit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      
      if (file.size > limit) {
        alert(`File too large! Max size: ${limit / (1024 * 1024)}MB`);
        e.target.value = ""; 
        return;
      }

     
      if (!isVideo) {
        try {
          file = await compressImage(file, 0.8);
        } catch (err) {
          console.error("Compression failed", err);
          
        }
      }

      setFiles(prev => ({ ...prev, [name]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- NEW: Helper function to upload a file directly to Cloudinary ---
  // This completely bypasses the Vercel backend payload limit
  const uploadToCloudinary = async (file, signatureData) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    
    // Explicitly set resource_type so Cloudinary doesn't accidentally treat a video as an image
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`,
      formData
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!files.image) {
        alert("Main image is required");
        setLoading(false);
        return;
      }

      // 1. Fetch secure signature from our backend
      // --- CHANGED: We now ask our backend for permission to upload directly ---
      const sigRes = await axios.get("https://super-store-backend-teal.vercel.app/api/v1/products/upload-signature");
      const signatureData = sigRes.data;

      // 2. Upload Main Image directly to Cloudinary
      const mainImageUrl = await uploadToCloudinary(files.image, signatureData);

      // 3. Upload Gallery Items directly to Cloudinary
      const galleryKeys = ['galleryImg1', 'galleryImg2', 'galleryImg3', 'galleryImg4', 'galleryVideo'];
      const uploadPromises = galleryKeys
        .filter(key => files[key]) // only upload if file exists
        .map(key => uploadToCloudinary(files[key], signatureData));
      
      // Wait for all gallery items to finish uploading
      const galleryUrls = await Promise.all(uploadPromises);

      // 4. Send the lightweight URLs to our backend to save the product
      // --- CHANGED: Instead of FormData with heavy files, we send a small JSON ---
      const productData = {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        originalPrice: formData.originalPrice,
        image: mainImageUrl,
        galleryUrls: galleryUrls
      };

      const res = await axios.post("https://super-store-backend-teal.vercel.app/api/v1/products/add", productData, {
        headers: { "Content-Type": "application/json" } // Send as JSON now!
      });

      if (res.status === 201) {
        alert('Product Added Successfully!');
        if (setProducts) setProducts(prev => [res.data.product, ...prev]);
        navigate('/admin');
      }
    } catch (error) {
      console.error("Upload error details:", error.response?.data || error);
      alert(error.response?.data?.message || error.response?.data?.error?.message || "Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  const renderFileInput = (name, label, accept = "image/*", isVideo = false) => (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-xs text-gray-400">({isVideo ? 'Max 50MB' : 'Max 9MB'})</span>
      </label>
      <div className="flex items-center gap-4">
        <div className="flex-1 relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer">
          <input 
            type="file" 
            name={name} 
            accept={accept}
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required={name === 'image'}
            disabled={loading}
          />
          <span className="text-gray-500 text-sm">
            {previewUrls[name] ? 'File Ready' : 'Click to upload'}
          </span>
        </div>
        {previewUrls[name] && (
          <div className="w-16 h-16 shrink-0 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
            {isVideo ? (
              <video src={previewUrls[name]} className="w-full h-full object-cover" />
            ) : (
              <img src={previewUrls[name]} alt="preview" className="w-full h-full object-cover" />
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-black py-6 px-8 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <Link to="/admin" className="hover:text-gray-300 text-sm flex items-center gap-2">← Back</Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
            <select name="category" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input type="number" name="price" placeholder="Selling Price" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
            <input type="number" name="originalPrice" placeholder="Original Price" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Media Uploads</h3>
            {renderFileInput('image', 'Main Image (Front)')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              {renderFileInput('galleryImg1', 'Gallery 1')}
              {renderFileInput('galleryImg2', 'Gallery 2')}
              {renderFileInput('galleryImg3', 'Gallery 3')}
              {renderFileInput('galleryImg4', 'Gallery 4')}
              <div className="md:col-span-2">{renderFileInput('galleryVideo', 'Gallery Video', 'video/*', true)}</div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-3 text-lg ${loading ? 'bg-gray-400' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            {loading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

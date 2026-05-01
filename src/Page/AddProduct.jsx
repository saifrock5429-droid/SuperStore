import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';

const categories = ["Ladies Watch", "Mens Watch", "Ladies Sunglasses", "Mens Sunglasses"];


// Constants for validation
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB

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

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      const isVideo = file.type.startsWith('video/');
      const limit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      
      if (file.size > limit) {
        alert(`File too large! Max size: ${limit / (1024 * 1024)}MB`);
        e.target.value = ""; 
        return;
      }

      setFiles(prev => ({ ...prev, [name]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('originalPrice', formData.originalPrice);
    
    if (files.image) data.append('image', files.image);

    // Append gallery items
    const galleryKeys = ['galleryImg1', 'galleryImg2', 'galleryImg3', 'galleryImg4', 'galleryVideo'];
    galleryKeys.forEach(key => {
      if (files[key]) data.append(key, files[key]);
    });

    try {
      const res = await axios.post("https://super-store-backend-teal.vercel.app/api/v1/products/add", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status === 201) {
        alert('Product Added Successfully!');
        if (setProducts) setProducts(prev => [res.data.product, ...prev]);
        navigate('/admin');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  const renderFileInput = (name, label, accept = "image/*", isVideo = false) => (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-xs text-gray-400">({isVideo ? 'Max 30MB' : 'Max 15MB'})</span>
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

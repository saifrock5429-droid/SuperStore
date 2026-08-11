// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router';

// const ManageProducts = ({ products, setProducts }) => {
//   const [activeCategory, setActiveCategory] = useState('All Categories');
//   const [deletingId, setDeletingId] = useState(null);

//   // const categories = ["Ladies Watch", "Mens Watch", "Ladies Sunglasses", "Mens Sunglasses", "Belts & Wallets", "All Bags", "Shoes", "All Categories"];
// const categories = ["Ladies Sunglasses", "Mens Sunglasses","All Categories"];



//   const filteredProducts = activeCategory === 'All Categories' 
//     ? products 
//     : products.filter(p => p.category === activeCategory);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this product? This will also remove the media from the database.')) {
//       setDeletingId(id);
      
//       try {
//         // Make sure your backend route matches this URL
//         const res = await axios.delete(`https://super-store-backend-teal.vercel.app/api/v1/products/delete/${id}`);
        
//         if (res.status === 200) {
//           // Remove from local state using MongoDB's _id
//           setProducts(prev => prev.filter(p => p._id !== id));
//         }
//       } catch (error) {
//         console.error(error);
//         alert(error.response?.data?.message || 'Failed to delete product');
//       } finally {
//         setDeletingId(null);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-red-600 py-6 px-8 flex justify-between items-center text-white">
//           <div>
//             <h2 className="text-2xl font-bold">Delete Products</h2>
//             <p className="text-red-100 text-sm mt-1">Manage and remove products from your store.</p>
//           </div>
//           <Link to="/admin" className="hover:text-red-200 font-medium text-sm flex items-center gap-2 transition-colors">
//             <span>←</span> Back to Admin
//           </Link>
//         </div>

//         {/* Category Filters */}
//         <div className="p-6 border-b bg-gray-50 flex flex-wrap gap-2">
//           {categories.map(cat => (
//             <button
//               key={cat}
//               onClick={() => setActiveCategory(cat)}
//               className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
//                 activeCategory === cat 
//                 ? 'bg-black text-white' 
//                 : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Product List */}
//         <div className="p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredProducts.map(product => (
//               <div key={product._id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow-sm relative group bg-white">
//                 <img src={product.image} alt={product.name} loading="lazy" className="w-full h-40 object-contain mb-4" />
//                 <h3 className="font-bold text-gray-800 text-center text-sm mb-1 line-clamp-1">{product.name}</h3>
//                 <p className="text-gray-500 text-xs mb-4">{product.category}</p>
//                 <p className="text-gray-500 text-xs mb-4">Created Date: {product.createdAt.slice(0, 10)}</p>
//                 <div className="flex items-center gap-2 mb-4">
//                    <span className="font-bold text-lg">₹{Number(product.price).toLocaleString('en-IN')}</span>
//                 </div>
                
//                 <button 
//                   onClick={() => handleDelete(product._id)}
//                   disabled={deletingId === product._id}
//                   className={`w-full py-2 rounded-lg font-semibold transition-colors mt-auto flex justify-center items-center ${
//                     deletingId === product._id 
//                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
//                     : 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white'
//                   }`}
//                 >
//                   {deletingId === product._id ? 'Deleting...' : 'Delete Product'}
//                 </button>
//               </div>
//             ))}
            
//             {filteredProducts.length === 0 && (
//               <div className="col-span-full py-16 text-center text-gray-500 italic">
//                 No products found in this category.
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ManageProducts;


import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

const categories = ["Ladies Sunglasses", "Mens Sunglasses", "All Categories"];

// Image compression helper
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

const ManageProducts = ({ products, setProducts }) => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [deletingId, setDeletingId] = useState(null);
  
  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const filteredProducts = activeCategory === 'All Categories' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // --- DELETE PRODUCT ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This will also remove the media.')) {
      setDeletingId(id);
      try {
        const res = await axios.delete(`https://super-store-backend-teal.vercel.app/api/v1/products/delete/${id}`);
        if (res.status === 200 || res.status === 204) {
          setProducts(prev => prev.filter(p => p._id !== id));
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Failed to delete product');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // --- EDIT MODAL HANDLERS ---
  const handleOpenEdit = (product) => {
    setEditingProduct({
      ...product,
      galleryUrls: product.galleryUrls || []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  // --- CLOUDINARY UPLOAD HELPER ---
  const uploadToCloudinary = async (file) => {
    const sigRes = await axios.get("https://super-store-backend-teal.vercel.app/api/v1/products/upload-signature");
    const signatureData = sigRes.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);

    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`,
      formData
    );
    return res.data.secure_url;
  };

  // --- EDIT MAIN IMAGE ---
  const handleMainImageChange = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      if (!file.type.startsWith('video/')) {
        file = await compressImage(file, 0.8);
      }
      const imageUrl = await uploadToCloudinary(file);
      setEditingProduct(prev => ({ ...prev, image: imageUrl }));
    } catch (err) {
      console.error("Main image update failed", err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // --- ADD / REPLACE GALLERY MEDIA ---
  const handleAddGalleryMedia = async (e, replaceIndex = null) => {
    let file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      if (!file.type.startsWith('video/')) {
        file = await compressImage(file, 0.8);
      }
      const mediaUrl = await uploadToCloudinary(file);

      setEditingProduct(prev => {
        const updatedGallery = [...(prev.galleryUrls || [])];
        if (replaceIndex !== null) {
          updatedGallery[replaceIndex] = mediaUrl;
        } else {
          updatedGallery.push(mediaUrl);
        }
        return { ...prev, galleryUrls: updatedGallery };
      });
    } catch (err) {
      console.error("Gallery update failed", err);
      alert("Failed to upload media");
    } finally {
      setUploadingImage(false);
    }
  };

  // --- DELETE GALLERY MEDIA ---
  const handleDeleteGalleryItem = (indexToDelete) => {
    setEditingProduct(prev => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_, idx) => idx !== indexToDelete)
    }));
  };

  // --- SAVE PRODUCT CHANGES ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: editingProduct.name,
        category: editingProduct.category,
        price: Number(editingProduct.price),
        originalPrice: Number(editingProduct.originalPrice),
        image: editingProduct.image,
        galleryUrls: editingProduct.galleryUrls
      };

      // Axios call with broader status validation & PUT request
      const res = await axios.put(
        `https://super-store-backend-teal.vercel.app/api/v1/products/edit/${editingProduct._id}`,
        payload,
        { 
          headers: { "Content-Type": "application/json" }
        }
      );

      if (res.status === 200 || res.status === 201) {
        alert("Product updated successfully!");
        
        const updatedItem = res.data.product || res.data.updatedProduct || { ...editingProduct, ...payload };
        
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? updatedItem : p));
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Update failed error:", error.response || error);
      const errMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to update product";
      alert(`Update Error: ${errMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-black py-6 px-8 flex justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold">Manage Products</h2>
            <p className="text-gray-300 text-sm mt-1">Edit price, replace images, or remove products.</p>
          </div>
          <Link to="/admin" className="hover:text-gray-300 font-medium text-sm flex items-center gap-2 transition-colors">
            <span>←</span> Back to Admin
          </Link>
        </div>

        {/* Category Filters */}
        <div className="p-6 border-b bg-gray-50 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === cat 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product List */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center shadow-sm relative group bg-white">
                <img src={product.image} alt={product.name} loading="lazy" className="w-full h-40 object-contain mb-4 rounded-lg bg-gray-50" />
                <h3 className="font-bold text-gray-800 text-center text-sm mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-xs mb-2">{product.category}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-lg text-black">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="w-full flex gap-2 mt-auto">
                  <button 
                    onClick={() => handleOpenEdit(product)}
                    className="flex-1 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                  >
                    Edit / Price
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                    className="px-3 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
                  >
                    {deletingId === product._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 italic">
                No products found in this category.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- EDIT PRODUCT MODAL --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setEditingProduct(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold border-b pb-3 mb-6">Edit Product Details</h3>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Text Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={editingProduct.name} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select 
                    name="category" 
                    value={editingProduct.category} 
                    onChange={handleInputChange} 
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none"
                  >
                    {categories.filter(c => c !== 'All Categories').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Selling Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={editingProduct.price} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none font-semibold text-green-700" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price (MRP ₹)</label>
                  <input 
                    type="number" 
                    name="originalPrice" 
                    value={editingProduct.originalPrice} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none" 
                  />
                </div>
              </div>

              {/* Main Image Edit */}
              <div className="border-t pt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">Main Front Image</label>
                <div className="flex items-center gap-4">
                  <img src={editingProduct.image} alt="Main" className="w-20 h-20 object-cover rounded-lg border" />
                  <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800">
                    Replace Main Image
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Gallery Images Edit */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-gray-600">Gallery Media (Images & Video)</label>
                  <label className="cursor-pointer bg-gray-100 border text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200">
                    + Add New Media
                    <input type="file" accept="image/*,video/*" onChange={(e) => handleAddGalleryMedia(e)} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {editingProduct.galleryUrls?.map((url, idx) => (
                    <div key={idx} className="relative group border rounded-lg overflow-hidden h-24 bg-gray-50 flex items-center justify-center">
                      {url.endsWith('.mp4') || url.includes('/video/upload/') ? (
                        <video src={url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      )}
                      
                      {/* Delete Overlay */}
                      <button 
                        type="button" 
                        onClick={() => handleDeleteGalleryItem(idx)} 
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-700"
                        title="Delete Media"
                      >
                        ✕
                      </button>

                      {/* Replace Overlay */}
                      <label className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded cursor-pointer hover:bg-black">
                        Change
                        <input type="file" accept="image/*,video/*" onChange={(e) => handleAddGalleryMedia(e, idx)} className="hidden" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingProduct(null)} 
                  className="px-5 py-2.5 text-gray-600 border rounded-xl text-sm font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving || uploadingImage} 
                  className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {uploadingImage ? 'Uploading Media...' : saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageProducts;
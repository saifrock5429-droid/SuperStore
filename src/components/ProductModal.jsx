
// niche wala image size ke liye kr rha hu and wo ready ho gya  
import { useState, useEffect } from 'react';

const ProductModal = ({ product, onClose }) => {

  // MOBILE & iOS BACK BUTTON
  useEffect(() => {
    const currentState = { modalOpen: true };
    window.history.pushState(currentState, "", window.location.href);

    const handlePopState = () => onClose();
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [onClose]);

  const isVideo = (url) => url && (url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov|ogg)$/));

  const allMedia = [product.image, ...(product.gallery || [])];
  const images = allMedia.filter(url => !isVideo(url)).slice(0, 6);
  const productVideo = allMedia.find(url => isVideo(url));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullVideo, setShowFullVideo] = useState(false);

  const nextMedia = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevMedia = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    setQuantity(isNaN(val) || val < 1 ? 1 : val);
  };

  const buyOnWhatsApp = () => {
    const msg = `*New Order*\nProduct: ${product.name}\nQuantity: ${quantity}\nCategory: ${product.category}\nPrice: ₹${product.price}\nImage: ${product.image}`;
    window.open(`https://wa.me/918976067924?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 md:p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto relative rounded-lg shadow-2xl flex flex-col md:flex-row p-4 md:p-6 gap-6">

        {/* CLOSE BUTTON */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/80 hover:bg-black text-white text-xl font-bold rounded-full shadow-lg z-50 transition-all border border-white/20 active:scale-95"
          title="Close"
        >
          ✕
        </button>

        {/* LEFT SIDE: EXACT IMAGE DISPLAY */}
        <div className="w-full md:w-1/2 flex flex-col items-center px-4 sm:px-6">
          {/* Replaced fixed heights with an aspect ratio and adjusted the max-width */}
          <div className="relative w-full max-w-[400px] sm:max-w-[500px] aspect-square bg-gray-50 rounded-md overflow-hidden flex items-center justify-center border border-gray-200"> {images.length > 1 && (
            <>
              <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md z-10 hover:bg-white text-gray-800">❮</button>
              <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md z-10 hover:bg-white text-gray-800">❯</button>
            </>
          )}

            <img
              src={images[currentIndex]}
              alt="product"
              className="w-full h-full object-cover  p-1"
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-2 mt-3 overflow-x-auto w-full justify-start md:justify-center pb-2">
            {images.map((item, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`relative shrink-0 cursor-pointer border-2 rounded-md overflow-hidden transition-all ${currentIndex === i ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <img src={item} alt="thumb" className="w-14 h-14 object-contain bg-white" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-between pt-2 md:pt-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-snug">{product.name}</h2>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#1a73e8] font-bold text-2xl">₹ {product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-gray-400 line-through text-sm">₹ {product.originalPrice}</span>
                  <span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-500 text-xs mb-4">Availability: <span className="text-green-600 font-semibold ml-1">In Stock</span></p>

            <div className="flex items-center gap-3 mb-6">
              {productVideo && (
                <button onClick={() => setShowFullVideo(true)} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-md hover:bg-blue-600 transition-colors bg-[#1a73e8] shadow-sm">
                  <span className="text-white text-sm font-bold flex items-center gap-1"><span>▷</span> Watch Video</span>
                </button>
              )}

              <button onClick={buyOnWhatsApp} className="flex-[1.5] bg-black text-white py-3 flex items-center justify-center gap-2 font-bold rounded-md text-xs uppercase hover:bg-green-600 transition-all shadow-md active:scale-95">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4" alt="wa" />
                <span>Buy on WhatsApp</span>
              </button>
            </div>

            <div className="mb-4">
              <p className="font-bold text-xs mb-1.5 uppercase text-gray-600">Quantity</p>
              <input type="number" min="1" value={quantity} onChange={handleQuantityChange} className="w-16 h-9 border border-gray-300 rounded text-center text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

      </div>

      {showFullVideo && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4">
          <button onClick={() => setShowFullVideo(false)} className="absolute top-6 right-6 text-white text-3xl font-light hover:text-gray-300 z-[120]">✕</button>
          <video src={productVideo} controls autoPlay className="max-w-full max-h-[85vh] rounded-md shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default ProductModal;






// import { useState, useEffect } from 'react';

// const ProductModal = ({ product, onClose }) => {

//   // Offer Suffix Text
//   const offerSuffix = " ₹799 — With Black Zipper Case ₹1,199 — With Original Brand Box 🚚 FREE Packing & Delivery";

//   // MOBILE & iOS BACK BUTTON
//   useEffect(() => {
//     const currentState = { modalOpen: true };
//     window.history.pushState(currentState, "", window.location.href);

//     const handlePopState = () => onClose();
//     window.addEventListener("popstate", handlePopState);

//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [onClose]);

//   const isVideo = (url) => url && (url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov|ogg)$/));

//   const allMedia = [product.image, ...(product.gallery || [])];
//   const images = allMedia.filter(url => !isVideo(url)).slice(0, 6);
//   const productVideo = allMedia.find(url => isVideo(url));

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [showFullVideo, setShowFullVideo] = useState(false);

//   const nextMedia = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   const prevMedia = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

//   const handleQuantityChange = (e) => {
//     const val = parseInt(e.target.value);
//     setQuantity(isNaN(val) || val < 1 ? 1 : val);
//   };

//   const buyOnWhatsApp = () => {
//     // WhatsApp msg me full formatted title bheja hai
//     const fullProductName = `${product.name}${offerSuffix}`;
//     const msg = `*New Order*\nProduct: ${fullProductName}\nQuantity: ${quantity}\nCategory: ${product.category}\nPrice: ₹${product.price}\nImage: ${product.image}`;
//     window.open(`https://wa.me/918976067924?text=${encodeURIComponent(msg)}`, '_blank');
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 md:p-4 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto relative rounded-lg shadow-2xl flex flex-col md:flex-row p-4 md:p-6 gap-6">

//         {/* CLOSE BUTTON */}
//         <button
//           onClick={() => window.history.back()}
//           className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/80 hover:bg-black text-white text-xl font-bold rounded-full shadow-lg z-50 transition-all border border-white/20 active:scale-95"
//           title="Close"
//         >
//           ✕
//         </button>

//         {/* LEFT SIDE: EXACT IMAGE DISPLAY */}
//         <div className="w-full md:w-1/2 flex flex-col items-center px-4 sm:px-6">
//           <div className="relative w-full max-w-[400px] sm:max-w-[500px] aspect-square bg-gray-50 rounded-md overflow-hidden flex items-center justify-center border border-gray-200">
//             {images.length > 1 && (
//               <>
//                 <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md z-10 hover:bg-white text-gray-800">❮</button>
//                 <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md z-10 hover:bg-white text-gray-800">❯</button>
//               </>
//             )}

//             <img
//               src={images[currentIndex]}
//               alt="product"
//               className="w-full h-full object-cover p-1"
//             />
//           </div>

//           {/* THUMBNAILS */}
//           <div className="flex gap-2 mt-3 overflow-x-auto w-full justify-start md:justify-center pb-2">
//             {images.map((item, i) => (
//               <div
//                 key={i}
//                 onClick={() => setCurrentIndex(i)}
//                 className={`relative shrink-0 cursor-pointer border-2 rounded-md overflow-hidden transition-all ${currentIndex === i ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-gray-300'}`}
//               >
//                 <img src={item} alt="thumb" className="w-14 h-14 object-contain bg-white" />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-full md:w-1/2 flex flex-col justify-between pt-2 md:pt-0">
//           <div>
//             {/* UPDATED TITLE DISPLAY */}
//             <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-snug">
//               {product.name}{offerSuffix}
//             </h2>

//             <div className="flex items-center gap-3 mb-2">
//               <span className="text-[#1a73e8] font-bold text-2xl">₹ {product.price}</span>
//               {product.originalPrice > product.price && (
//                 <>
//                   <span className="text-gray-400 line-through text-sm">₹ {product.originalPrice}</span>
//                   <span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded">
//                     {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
//                   </span>
//                 </>
//               )}
//             </div>

//             <p className="text-gray-500 text-xs mb-4">Availability: <span className="text-green-600 font-semibold ml-1">In Stock</span></p>

//             <div className="flex items-center gap-3 mb-6">
//               {productVideo && (
//                 <button onClick={() => setShowFullVideo(true)} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-md hover:bg-blue-600 transition-colors bg-[#1a73e8] shadow-sm">
//                   <span className="text-white text-sm font-bold flex items-center gap-1"><span>▷</span> Watch Video</span>
//                 </button>
//               )}

//               <button onClick={buyOnWhatsApp} className="flex-[1.5] bg-black text-white py-3 flex items-center justify-center gap-2 font-bold rounded-md text-xs uppercase hover:bg-green-600 transition-all shadow-md active:scale-95">
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4" alt="wa" />
//                 <span>Buy on WhatsApp</span>
//               </button>
//             </div>

//             <div className="mb-4">
//               <p className="font-bold text-xs mb-1.5 uppercase text-gray-600">Quantity</p>
//               <input type="number" min="1" value={quantity} onChange={handleQuantityChange} className="w-16 h-9 border border-gray-300 rounded text-center text-sm focus:outline-none focus:border-blue-500" />
//             </div>
//           </div>
//         </div>

//       </div>

//       {showFullVideo && (
//         <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4">
//           <button onClick={() => setShowFullVideo(false)} className="absolute top-6 right-6 text-white text-3xl font-light hover:text-gray-300 z-[120]">✕</button>
//           <video src={productVideo} controls autoPlay className="max-w-full max-h-[85vh] rounded-md shadow-2xl" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductModal;
// const ProductCard = ({ product, onClick }) => {
//   const sendWhatsApp = () => {
    
//     const msg = `*Order Inquiry*\nProduct: ${product.name}\nCategory: ${product.category}\nPrice: ₹${product.price}\nImage: ${product.image}`;
//     window.open(`https://wa.me/918976067924?text=${encodeURIComponent(msg)}`, '_blank');
//   };

//   // Calculate discount percentage
//   const discount = product.originalPrice > product.price 
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
//     : 0;

//   return (
//     <div onClick={onClick} className="bg-white border border-gray-100 p-4 flex flex-col group transition-all hover:shadow-2xl cursor-pointer relative">
      


//       <div className="bg-[#fcfcfc] aspect-square flex items-center justify-center mb-4 overflow-hidden relative">
//         <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
//       </div>

//       <div className="flex-1">
//         <h3 className="text-gray-800 text-[13px] font-medium mb-1 line-clamp-1 uppercase">{product.name}</h3>
//         <div className="flex items-center gap-2 mb-2">
//           {/* Using toLocaleString for proper comma formatting */}
//           <span className="text-black font-bold text-lg">₹ {Number(product.price).toLocaleString('en-IN')}</span>
//           {product.originalPrice > product.price && (
//             <span className="text-gray-400 line-through text-xs">₹ {Number(product.originalPrice).toLocaleString('en-IN')}</span>
//           )}
//         </div>
        
//         {/* Changed from hardcoded 'Small' to show the Category */}
//         <p className="text-gray-400 text-[10px] mb-4 uppercase tracking-tighter">SMALL</p>
        
//         <button onClick={sendWhatsApp} className="w-full bg-[#1a73e8] hover:bg-green-600 text-white text-[10px] font-bold py-3 uppercase tracking-widest transition-all">
//           Inquiry on WhatsApp
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

// ProductCard.jsx

import { useState } from "react";

const ProductCard = ({ product, onClick }) => {

  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);



  // FIRST WHATSAPP
  const sendWhatsApp1 = () => {

    const msg = `*Order Inquiry*\nProduct: ${product.name}\nCategory: ${product.category}\nPrice: ₹${product.price}\nImage: ${product.image}`;

    window.open(
      `https://wa.me/918976067924?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  };



  // SECOND WHATSAPP
  const sendWhatsApp2 = () => {

    const msg = `*Order Inquiry*\nProduct: ${product.name}\nCategory: ${product.category}\nPrice: ₹${product.price}\nImage: ${product.image}`;

    window.open(
      `https://wa.me/918928460224?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  };



  // DISCOUNT
  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0;



  return (

    <div
      onClick={onClick}
      className="bg-white border border-gray-100 p-4 flex flex-col group transition-all hover:shadow-2xl cursor-pointer relative"
    >

      {/* IMAGE */}
      <div className="bg-[#fcfcfc] aspect-square flex items-center justify-center mb-4 overflow-hidden relative">

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

      </div>



      <div className="flex-1">

        {/* PRODUCT NAME */}
        <h3 className="text-gray-800 text-[13px] font-medium mb-1 line-clamp-1 uppercase">
          {product.name}
        </h3>



        {/* PRICE */}
        <div className="flex items-center gap-2 mb-2">

          <span className="text-black font-bold text-lg">
            ₹ {Number(product.price).toLocaleString('en-IN')}
          </span>

          {product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-xs">
              ₹ {Number(product.originalPrice).toLocaleString('en-IN')}
            </span>
          )}

        </div>



        {/* CATEGORY */}
        <p className="text-gray-400 text-[10px] mb-4 uppercase tracking-tighter">
          {product.category}
        </p>



        {/* MAIN BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowWhatsAppOptions(!showWhatsAppOptions);
          }}
          className="w-full bg-[#1a73e8] hover:bg-green-600 text-white text-[10px] font-bold py-3 uppercase tracking-widest transition-all"
        >
          Inquiry on WhatsApp
        </button>



        {/* WHATSAPP OPTIONS */}
        {showWhatsAppOptions && (

          <div className="mt-2 flex flex-col gap-2">

            {/* WHATSAPP 1 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sendWhatsApp1();
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold py-2 uppercase tracking-widest transition-all rounded"
            >
              WhatsApp 1
            </button>



            {/* WHATSAPP 2 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sendWhatsApp2();
              }}
              className="w-full bg-black hover:bg-gray-800 text-white text-[10px] font-bold py-2 uppercase tracking-widest transition-all rounded"
            >
              WhatsApp 2
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default ProductCard;

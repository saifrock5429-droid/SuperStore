import React from 'react';

const CategoryButtons = ({ activeCategory, setActiveCategory }) => {
  // const cats = ["Ladies Watch", "Mens Watch", "Ladies Sunglasses", "Mens Sunglasses", "Belts & Wallets", "All Bags", "Shoes", "All Categories"];
const cats = [ "Ladies Sunglasses", "Mens Sunglasses", "All Categories"];
  return (
    <div className="max-w-[95%] md:max-w-[80%] mx-auto my-8">
      <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 md:gap-4">
        {cats.map((item) => (
          <button
            key={item}
            onClick={() => setActiveCategory(item)}
            className={`py-4 px-6 text-sm font-medium transition-all duration-300 text-center shadow-md
              ${activeCategory === item 
                ? 'bg-black text-white' 
                : 'bg-[#1a73e8] text-white hover:bg-black hover:text-white'
              }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;

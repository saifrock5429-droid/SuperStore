

import logoImage from "../assets/LOGO.jpeg";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      
      <nav className="max-w-[95%] md:max-w-[80%] mx-auto py-4 flex justify-between items-center gap-4">

        {/* LOGO */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-16 flex items-center justify-center overflow-hidden">
            <img 
              src={logoImage}
              alt="Choice Store Logo" 
              className="max-h-full max-w-full object-contain" 
            />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-[220px] md:w-[350px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-full outline-none focus:border-black"
          />
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#223A60] text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">Ropani AI</div>

      {/* Menu */}
      <ul className="hidden md:flex space-x-6 font-medium">
        <li className="hover:text-[#FECC0F] cursor-pointer">Home</li>
        <li className="hover:text-[#FECC0F] cursor-pointer">Land</li>
        <li className="hover:text-[#FECC0F] cursor-pointer">About Us</li>
        <li className="hover:text-[#FECC0F] cursor-pointer">Contact Us</li>
        <li className="hover:text-[#FECC0F] cursor-pointer">Login</li>
      </ul>

      {/* Search + Dashboard */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search Location"
          className="px-3 py-2 rounded-lg text-black focus:outline-none"
        />
        <button className="bg-[#FECC0F] text-black px-4 py-2 rounded-lg hover:bg-yellow-500">
          Dashboard
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

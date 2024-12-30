import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`navbar bg-[#003FA4] text-white fixed top-3 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg w-[90%] lg:w-[70%] z-50 flex justify-between items-center px-4 transition-all duration-300 ${
        isScrolled ? "py-0 px-28 rounded-3xl center-1 opacity-95 bg-[#2656a1] top-0 shadow-md " : "py-4 top-3"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <a className="btn btn-ghost normal-case font-bold">
          <img
            src="src/assets/logostroke.png"
            alt="TutorMe Logo"
            className={`h-10 transition-all duration-300 ${
              isScrolled ? "h-0" : "h-14"
            }`}
          />
        </a>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Menu Links */}
      <div
        className={`lg:flex lg:items-center lg:space-x-6 ${
          isMenuOpen ? "block" : "hidden"
        } absolute lg:static top-16 left-0 w-full lg:w-auto bg-[#003FA4] lg:bg-transparent z-40 rounded-lg lg:rounded-none p-4 lg:p-0`}
      >
        <ul className="menu lg:menu-horizontal px-1 space-y-4 lg:space-y-0 lg:space-x-6">
          <li>
            <a className="text-white font-normal text-lg hover:text-gray-200">
              Home
            </a>
          </li>
          <li>
            <a className="text-white text-lg font-extralight hover:text-gray-200">
              Find Tutor
            </a>
          </li>
          <li>
            <a className="text-white text-lg font-extralight hover:text-gray-200">
              Become a Tutor
            </a>
          </li>
          <li>
            <a className="text-white text-lg font-extralight hover:text-gray-200">
              About
            </a>
          </li>
        </ul>
      </div>

      {/* Login Button */}
      <div className="hidden lg:flex items-center ml-4">
        <button className="btn rounded-full btn-white text-lg text-blue border-white hover:bg-white hover:text-blue-500 px-6 mr-4">
          Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;

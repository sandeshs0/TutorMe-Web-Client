


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Using AuthContext for user and logout



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
  // const handleLogout = () => {
  //   localStorage.clear();
  //   setIsLoggedIn(false);
  //   setUser(null);
  //   navigate("/");
  // };

  return (
    <div
      className={`navbar fixed top-0 left-1/2 mt-4 transform -translate-x-1/2 rounded-full shadow-lg w-[90%] lg:w-[80%] z-50 flex justify-between items-center px-4 transition-all duration-300 ${
        isScrolled ? "py-1 bg-primary/90 mt-1 text-white shadow-md" : "py-4 bg-primary text-white"
      }`}
    >
      {/* Logo */}
      <div className="hidden lg:flex items-center">
        <a href="/" className="bg-transparent normal-case text-xl font-bold transition-all duration-600">
          <img
            src="src/assets/logostroke.png"
            alt="TutorMe Logo"
            className={`${isScrolled ? "h-10" : "h-12"}`}
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
          isMenuOpen ? "flex flex-col items-center bg-primary w-full absolute top-full left-0 z-40 rounded-b-lg p-4" : "hidden"
        } lg:bg-transparent lg:static lg:p-0`}
      >
        <ul className="menu lg:menu-horizontal px-1 space-y-4 lg:space-y-0 lg:space-x-6">
          <li>
            <a className="text-lg font-light text-white font-poppins hover:font-bold hover:text-xl hover:bg-transparent transition-colors">
              Home
            </a>
          </li>
          <li>
            <a className="text-lg font-light text-white font-poppins hover:font-bold hover:text-xl hover:bg-transparent transition-colors">
              Find Tutor
            </a>
          </li>
          <li>
            <a className="text-lg font-light text-white font-poppins hover:font-bold hover:text-xl hover:bg-transparent transition-colors">
              Become a Tutor
            </a>
          </li>
          <li>
            <a className="text-lg font-light text-white font-poppins hover:font-bold hover:text-xl hover:bg-transparent transition-colors">
              About
            </a>
          </li>
        </ul>
      </div>

      <div className=" lg:flex items-center ml-4">

        <div>
          {!user ? (
        <button className={`btn rounded-full bg-[#ffffff] hover:bg-primary-light hover:text-white hover:border-white text-black px-6 mr-4 transition-colors duration-300 ${isScrolled ? "text-sm mr-0" : "text-lg px-6"}`} onClick={() => navigate("/login")}>
        Login
        
      </button>
          ) : (
            <ProfileDropdown userName={user?.name || "User"}  userAvatar={user?.profileImage}
            // onLogout={() => {
            //   logout(); // Call the logout function from AuthContext
            //   navigate("/"); // Redirect to home after logout
            // }}
            />
            // <div className="relative">
            //   <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg shadow">
            //     <i className="fas fa-user-circle text-xl text-blue-500"></i>
            //     <span>{user.name}</span>
            //   </button>

            //   <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
            //     <button
            //       onClick={() => navigate("/my-account")}
            //       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            //     >
            //       My Account
            //     </button>
            //     <button
            //       onClick={() => navigate("/settings")}
            //       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            //     >
            //       Settings
            //     </button>
            //     <button
            //       onClick={handleLogout}
            //       className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            //     >
            //       Logout
            //     </button>
            //   </div>
            // </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

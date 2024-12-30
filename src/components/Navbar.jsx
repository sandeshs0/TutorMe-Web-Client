import React from "react";

const Navbar = () => {
  return (
    <div className="navbar bg-blue-500 text-white fixed top-3 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg w-[70%] z-50">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl font-bold">
          <img
            src="src\assets\logostroke.png"
            alt="TutorMe Logo"
            className="h-12 mr-2 "
          />        </a>
      </div>
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="text-white font-semibold hover:text-gray-200">
              Home
            </a>
          </li>
          <li>
            <a className="text-white font-semibold hover:text-gray-200">
              Find Tutor
            </a>
          </li>
          <li>
            <a className="text-white font-semibold hover:text-gray-200">
              Become a Tutor
            </a>
          </li>
          <li>
            <a className="text-white font-semibold hover:text-gray-200">
              About TutorMe
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-none">
        <button className="btn btn-outline btn-white text-white border-white hover:bg-white hover:text-blue-500">
          Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;

import { Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const NavbarTwo = ({ student }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const navigate = useNavigate();
  // const { user } = useAuth();
  console.log(student);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`navbar border-b-gray-600 fixed top-0 left-1/2 transform -translate-x-1/2 shadow-sm w-[100%] lg:w-[100%] z-50 flex justify-between items-center lg:px-16 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white dark:bg-gray-800 text-black dark:text-white shadow-md dark:shadow-sm dark:shadow-gray-600"
          : "py-4 bg-white dark:bg-gray-800 text-black dark:text-white dark:shadow-sm dark:shadow-gray-600"
      }`}
    >
      <div className="hidden lg:flex items-center">
        <a
          href="/"
          className="bg-transparent normal-case text-xl font-bold transition-all duration-600"
        >
          <img
            src="src/assets/logostroke.png"
            alt="TutorMe Logo"
            className={`${isScrolled ? "h-10" : "h-12"}`}
          />
        </a>
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-black dark:text-white focus:outline-none"
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
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      <div
        className={`lg:flex lg:items-center lg:space-x-6 ${
          isMenuOpen
            ? "flex flex-col shadow-md items-center bg-white dark:bg-gray-800 w-full absolute top-full left-0 z-40 rounded-b-lg p-4"
            : "hidden"
        } lg:bg-transparent lg:static lg:p-0`}
      >
        <ul className="menu lg:menu-horizontal px-1 space-y-4 lg:space-y-0 lg:space-x-6">
          <li>
            <a
              href="/"
              className="text-lg font-light font-poppins hover:font-bold hover:text-xl hover:bg-transparent transition-colors dark:hover:text-gray-300"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/browse"
              className="text-lg font-light font-poppins hover:font-bold hover:text-xl hover:bg-transparent transition-colors dark:hover:text-gray-300"
            >
              Find Tutor
            </a>
          </li>
          <li>
            <a className="text-lg font-light font-poppins hover:font-bold hover:text-xl hover:bg-transparent transition-colors dark:hover:text-gray-300">
              Become a Tutor
            </a>
          </li>
          <li>
            <a className="text-lg font-light font-poppins hover:font-bold hover:text-xl hover:bg-transparent transition-colors dark:hover:text-gray-300">
              About
            </a>
          </li>
        </ul>
      </div>

      <div className="lg:flex items-center ml-4">
        <div>
          {student && (
            <div className="flex items-center mr-4 space-x-2 bg-green-100 dark:bg-green-900 backdrop-blur-sm px-4 py-2 rounded-xl transition-all hover:bg-white/20">
              <Wallet className="text-green-800 dark:text-green-300 font-bold" />
              <span className="font-medium text-green-900 dark:text-green-100">
                Rs. {student?.walletBalance?.toLocaleString() || 0}
              </span>
            </div>
          )}
        </div>

        <div>
          {!student ? (
            <button
              className={`btn rounded-full bg-white dark:bg-gray-700 hover:bg-primary-light hover:text-white text-black dark:text-white px-6 mr-4 transition-colors duration-300 ${
                isScrolled ? "text-sm mr-0" : "text-lg px-6"
              }`}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <ProfileDropdown
              userName={student?.name || "User"}
              userAvatar={student?.profileImage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarTwo;

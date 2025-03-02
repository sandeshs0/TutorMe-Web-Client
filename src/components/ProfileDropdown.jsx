import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const ProfileDropdown = ({ userName, userAvatar }) => {
  const { logout } = useAuth(); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleLogout = () => {
    logout(); 
    toast.info("Logout successful", { position: "bottom-right" });
    navigate("/");
  };

  const generateInitialsAvatar = (name) => {
    const firstLetter = name?.charAt(0)?.toUpperCase() || "?"; 
    return (
      <div className="w-8 h-8 flex font-sans items-center justify-center rounded-full bg-purple-500 text-white mr-2">
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="dropdown dropdown-end dropdown-hover relative inline-block">
      <button
        tabIndex={0}
        className="flex items-center px-3 py-2 bg-blue-900 dark:bg-gray-800 text-white font-medium rounded-full hover:bg-blue-900 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-gray-500"
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-white mr-2"
          />
        ) : (
          generateInitialsAvatar(userName)
        )}
        <span className="hidden sm: font-sans">{userName}</span>{" "}
        <i className="fas fa-chevron-down ml-2 text-sm"></i>
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu font-poppins font-semibold bg-gray-50 dark:bg-gray-900 rounded-lg z-10 w-52 mt-2 shadow-lg p-2 text-sm text-gray-900 dark:text-white"
      >
        <li>
          <p className="block px-4 py-2 mb-1 bg-blue-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-600 rounded-md">
            {userName}
          </p>
        </li>
        {user.role === "tutor" && (
          <li>
            <a
              href="/tutor-dashboard"
              className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-600 rounded-md"
            >
              Tutor Dashboard
            </a>
          </li>
        )}
        <li>
          <a
            href="/account-center"
            className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-600 rounded-md"
          >
            My Account
          </a>
        </li>
        <li>
          <a
            href="/settings"
            className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-600 rounded-md"
          >
            Settings
          </a>
        </li>
        <li>
          <div
            onClick={toggleDarkMode}
            className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-600 rounded-md"
          >
            Switch Mode
            {darkMode ? (
              <>
                <i className="fas fa-sun text-yellow-400 ml-2"></i>
              </>
            ) : (
              <i className="fas fa-moon text-blue-900 ml-2"></i>
            )}
          </div>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-md"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;

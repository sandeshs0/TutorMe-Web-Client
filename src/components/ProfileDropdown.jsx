import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";


const ProfileDropdown = ({ userName, userAvatar }) => {
  const { logout } = useAuth(); // Use AuthContext for logout
  const navigate = useNavigate();
    const { user } = useAuth();

  const handleLogout = () => {
    logout(); // Clear user data and navigate
    toast.info("Logout successful", { position: "bottom-right" });
    navigate("/");
  };

  const generateInitialsAvatar = (name) => {
    const firstLetter = name?.charAt(0)?.toUpperCase() || "?"; // Get the first letter of the first name
    return (
      <div className="w-8 h-8 flex font-sans items-center justify-center rounded-full bg-purple-500 text-white mr-2">
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="dropdown dropdown-end dropdown-hover relative inline-block">
      {/* Profile Button */}
      <button
        tabIndex={0}
        className="flex items-center px-3 py-2 bg-blue-900 text-white font-medium rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
        {/* Hide on small screens */}
        <i className="fas fa-chevron-down ml-2 text-sm"></i>
      </button>

      {/* Dropdown Menu */}
      {/* {isOpen && (
        <div className="absolute dropdown right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-2">
            <a
              href="/account"
              className="block btn-ghost px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Account
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )} */}

      <ul
        tabIndex={0}
        className="dropdown-content menu font-poppins font-semibold bg-gray-50 rounded-lg z-10 w-52 mt-2 shadow-lg p-2 text-sm"
      >
        <li>
          <p className="block px-4 py-2 mb-1 text-gray-900 bg-blue-100 hover:bg-blue-100 rounded-md">
            {userName}
          </p>
        </li>
        {user.role === "tutor" && (
          <li>
            <a
              href="/tutor-dashboard"
              className="block px-4 py-2 text-gray-900 hover:bg-blue-100 rounded-md"
            >
Tutor Dashboard           
 </a>
          </li>
        )}
        <li>
          <a
            href="/account"
            className="block px-4 py-2 text-gray-900 hover:bg-blue-100 rounded-md"
          >
            My Account
          </a>
        </li>
        <li>
          <a
            href="/settings"
            className="block px-4 py-2 text-gray-900 hover:bg-blue-100 rounded-md"
          >
            Settings
          </a>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 rounded-md"
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

import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const TutorProfileDropdown = ({ userName, userAvatar }) => {
  const { logout } = useAuth(); 
  const navigate = useNavigate();

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
        className="flex items-center text-white font-medium rounded-full hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-14 h-14 rounded-full border-2 border-white"
          />
        ) : (
          generateInitialsAvatar(userName)
        )}
        <span className="hidden sm: font-sans">{userName}</span>{" "}
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu font-poppins font-semibold bg-gray-50 rounded-lg z-10 w-52 mt-2 shadow-lg p-2 text-sm"
      >
        <li>
          <p className="block px-4 py-2 mb-1 text-gray-900 bg-blue-100 hover:bg-blue-100 rounded-md">
            {userName}
          </p>
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

export default TutorProfileDropdown;

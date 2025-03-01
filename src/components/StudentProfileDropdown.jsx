import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const StudentProfileDropdown = ({ userName, userAvatar }) => {
  const { logout } = useAuth(); // Use AuthContext for logout
  const navigate = useNavigate();
  console.log("User Avatar: ", userAvatar);

  const handleLogout = () => {
    logout(); // Clear user data and navigate
    toast.info("Logout successful", { position: "bottom-right" });
    navigate("/");
  };

  const generateInitialsAvatar = (name) => {
    const firstLetter = name?.charAt(0)?.toUpperCase() || "?"; // Get the first letter of the first name
    return (
      <div className="w-12 h-12 flex font-sans text-lg font-bold items-center justify-center rounded-full bg-green-700 text-white ">
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="dropdown dropdown-end dropdown-hover relative inline-block">
      {/* Profile Button */}
      <button
        tabIndex={0}
        className="flex items-center text-white font-medium rounded-full hover:bg-green-900 focus:outline-none"
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
      </button>

      {/* Dropdown Menu */}
      <ul
        tabIndex={0}
        className="dropdown-content menu font-poppins font-semibold bg-gray-50 rounded-lg z-10 w-52 mt-2 shadow-lg p-2 text-sm"
      >
        <li>
          <p className="block px-4 py-2 mb-1 text-gray-900 bg-green-100 hover:bg-green-100 rounded-md">
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

export default StudentProfileDropdown;

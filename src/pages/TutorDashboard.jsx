import React , { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ProfileDropdown from "../components/ProfileDropdown";
import { useAuth } from "../context/AuthContext";


const TutorDashboard = () => {
    const { user } = useAuth(); // Using AuthContext for user and logout
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">Tutor Dashboard</div>
        <nav className="flex-grow">
          <ul className="space-y-4 px-4">
            <li>
              <NavLink
                to="/tutor-dashboard/overview"
                className={({ isActive }) =>
                  isActive ? "text-blue-300 font-semibold" : "hover:text-blue-400"
                }
              >
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tutor-dashboard/classes"
                className={({ isActive }) =>
                  isActive ? "text-blue-300 font-semibold" : "hover:text-blue-400"
                }
              >
                My Classes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tutor-dashboard/schedule"
                className={({ isActive }) =>
                  isActive ? "text-blue-300 font-semibold" : "hover:text-blue-400"
                }
              >
                Schedule
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tutor-dashboard/profile"
                className={({ isActive }) =>
                  isActive ? "text-blue-300 font-semibold" : "hover:text-blue-400"
                }
              >
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <button className="w-full bg-red-600 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span>Welcome, Tutor</span> */}
                        <ProfileDropdown userName={user?.name || "User"}  userAvatar={user?.profileImage}/>

          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-grow p-6 bg-gray-100">
          <Outlet /> {/* This is where nested routes will be rendered */}
        </main>
      </div>
    </div>
  );
};

export default TutorDashboard;

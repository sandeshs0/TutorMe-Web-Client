import React from "react";
import { FaCheckCircle, FaRegStar, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TutorCardGrid = ({ tutor }) => {
  const navigate = useNavigate();
  const handleViewProfile = () => {
    navigate(`/tutors/${tutor.username}`); // Use the username to navigate to the profile
  };
  return (
    <div className="group bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out relative overflow-hidden">
      {/* Profile Header Section */}
      <div className="relative mb-6">
        <div className="relative w-full h-48 rounded-xl overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
          <img
            src={tutor.profileImage || "https://via.placeholder.com/400x200"}
            alt={tutor.name}
            className="w-full h-full object-cover"
          />

          {/* Online Status */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full backdrop-blur-sm">
            <span
              className={`w-3 h-3 rounded-full ${
                tutor.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tutor.isOnline ? "Available Now" : "Offline"}
            </span>
          </div>
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="relative w-20 h-20 border-4 border-white dark:border-gray-800 rounded-full shadow-lg">
            <img
              src={tutor.profileImage || "https://via.placeholder.com/100"}
              alt={tutor.name}
              className="w-full h-full rounded-full object-cover"
            />
            {tutor.isVerified && (
              <FaCheckCircle className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full text-xl" />
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-10 text-center">
        {/* Name and Bio */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          {tutor.name}
        </h2>
        {tutor.bio && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {tutor.bio}
          </p>
        )}

        {/* Rating and Price */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center bg-primary/10 dark:bg-gray-600 px-3 py-1 rounded-full">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="text-yellow-600 text-lg">
                {index < tutor.rating ? <FaStar /> : <FaRegStar />}
              </span>
            ))}
            <span className="text-gray-600 dark:text-gray-100 text-sm font-medium ml-2">
              {tutor.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            ₹{tutor.hourlyRate}
            <span className="text-sm font-normal text-gray-500 ml-1">/hr</span>
          </span>
        </div>

        {/* Expertise */}
        {tutor.subjects?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
              Teaching Expertise
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {tutor.subjects.slice(0, 4).map((subject, index) => (
                <span
                  key={index}
                  className="bg-primary/80 text-gray-100 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-primary/60 transition-colors"
                >
                  {subject.replace(/["[\]]/g, "")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleViewProfile}
          className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <span>View Profile</span>
        </button>
      </div>

      {/* Floating Stats */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm">
          {tutor.lessonsTaught || "100+"} lessons
        </span>
      </div>
    </div>
  );
};

export default TutorCardGrid;

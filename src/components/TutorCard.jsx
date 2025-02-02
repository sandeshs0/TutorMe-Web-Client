import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

const TutorCardGrid = ({ tutor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative flex flex-col items-center">
        {/* Profile Image with Online Status Indicator */}
        <div className="relative w-32 h-32">
          <img
            src={tutor.profileImage || "https://via.placeholder.com/150"}
            alt={tutor.name}
            className="w-full h-full rounded-full border-4 border-primary dark:border-primary-500 object-cover"
          />
          {/* Online status as a dot */}
          <span
            className={`absolute bottom-2 right-2 w-4 h-4 rounded-full ${
              tutor.isOnline ? "bg-green-500" : "bg-gray-400"
            } border-2 border-white dark:border-gray-800`}
          />
        </div>

        {/* Tutor Details */}
        <h2 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">
          {tutor.name}
        </h2>
        {tutor.bio && (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            {tutor.bio}
          </p>
        )}

        {/* Ratings */}
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, index) => (
            <span key={index} className="text-yellow-400">
              {index < tutor.rating ? <FaStar /> : <FaRegStar />}
            </span>
          ))}
          <p className="text-gray-500 dark:text-gray-400 text-sm ml-2">
            {tutor.rating.toFixed(1)} / 5
          </p>
        </div>

        {/* Expertise */}
        {tutor.subjects?.length > 0 && (
          <div className="w-full mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Expertise in:
            </p>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects?.map((subject, index) => (
                <span
                  key={index}
                  className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full"
                >
                  {subject.replace(/["[\]]/g, "")}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rate & Book Button */}
        <div className="flex justify-between items-center w-full mt-4">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Rs. {tutor.hourlyRate}/hr
          </p>
          <button className="bg-primary btn text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCardGrid;

import React from "react";
import { FaStar, FaRegStar, FaBookOpen } from "react-icons/fa";

const TutorCardList = ({ tutor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 flex items-center gap-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition">
      
      {/* Profile Image */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary">
        <img src={tutor.profileImage || "https://via.placeholder.com/100"} alt={tutor.name} className="w-full h-full object-cover" />
        <span className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${tutor.isOnline ? "bg-green-500" : "bg-gray-400"}`} />
      </div>

      {/* Tutor Info */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{tutor.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{tutor.bio || "Experienced Tutor"}</p>

        {/* Rating & Subjects */}
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, index) => (
            <span key={index} className="text-yellow-400">
              {index < tutor.rating ? <FaStar /> : <FaRegStar />}
            </span>
          ))}
          <span className="ml-2 text-gray-600 dark:text-gray-400">{tutor.rating.toFixed(1)} / 5</span>
        </div>

        {/* Subjects */}
        {tutor.subjects?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tutor.subjects.slice(0, 3).map((subject, index) => (
              <span key={index} className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                {subject}
              </span>
            ))}
            {tutor.subjects.length > 3 && <span className="text-gray-500 text-xs">+{tutor.subjects.length - 3} more</span>}
          </div>
        )}
      </div>

      {/* Price & Book Button */}
      <div className="text-right">
        <p className="text-md font-semibold text-gray-900 dark:text-white">Rs. {tutor.hourlyRate}/hr</p>
        <button className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-focus transition flex items-center gap-2">
          <FaBookOpen /> Book
        </button>
      </div>

    </div>
  );
};

export default TutorCardList;
import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

const TutorCard = ({ tutor }) => {
  return (
    <div className="bg-white font-poppins shadow-lg rounded-xl p-6 max-w-sm w-full border border-gray-200 hover:shadow-2xl transition">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="w-28 h-28 rounded-full border-4 border-primary overflow-hidden">
          <img
            src={tutor.profileImage || "https://via.placeholder.com/150"}
            alt={tutor.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tutor Details */}
        <h2 className="mt-4 text-lg font-bold text-gray-800">{tutor.name}</h2>
        {tutor.bio && <p className="text-gray-500 text-sm mt-2">{tutor.bio}</p>}

        {/* Ratings */}
        <div className="flex items-center mt-3">
          {[...Array(5)].map((_, index) => (
            <span key={index} className="text-yellow-400">
              {index < tutor.rating ? <FaStar /> : <FaRegStar />}
            </span>
          ))}
          <p className="text-gray-500 text-sm ml-2">
            {tutor.rating.toFixed(1)} / 5
          </p>
        </div>

        {/* Expertise */}
        {tutor.subjects?.length > 0 && (
          <div className="w-full mt-4 bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Expertise in:
            </p>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects &&
                tutor.subjects.flatMap((subjectString) =>
                  subjectString.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {skill.trim()} {/* Trim to remove any extra spaces */}
                    </span>
                  ))
                )}
            </div>
          </div>
        )}

        {/* Rate and Book Button */}
        <div className="flex justify-between items-center w-full mt-4">
          <p className="text-lg font-poppins font-semibold text-gray-800">
            Rs. {tutor.hourlyRate}/hr
          </p>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-focus transition">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;

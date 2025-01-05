import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const TutorCard = ({ tutor }) => {
  return (
    <div className="bg-white font-poppins shadow-lg rounded-xl p-6 max-w-sm w-full border border-gray-300">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="w-28 h-28 rounded-full border-4 border-blue-500 overflow-hidden">
          <img
            src={tutor.image}
            alt={tutor.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tutor Details */}
        <h2 className="mt-4 text-lg font-bold text-gray-800">{tutor.name}</h2>
        <p className="text-gray-500 text-sm">Exp: {tutor.experience}</p>

        {/* Ratings */}
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, index) => (
            <span key={index} className="text-yellow-400">
              {index < tutor.rating ? <FaStar /> : <FaRegStar />}
            </span>
          ))}
        </div>

        {/* Expertise */}
        <div className="w-full mt-4 bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-600 mb-2">Expertise in:</p>
          <div className="flex flex-wrap gap-2">
            {tutor.expertise.map((skill, index) => (
              <span
                key={index}
                className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Rate and Book Button */}
        <div className="flex justify-between items-center w-full mt-4">
          <p className="text-lg font-poppins font-semibold text-gray-800">
            Rs. {tutor.hourlyRate}/hr
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;

import React from "react";
import { FaStar, FaRegStar, FaCheckCircle } from "react-icons/fa";

const TutorCardList = ({ tutor }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 w-full hover:-translate-y-1">
      {/* Profile Image */}
      <div className="relative flex-shrink-0 mx-auto sm:mx-0">
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-primary/10 relative">
          <img 
            src={tutor.profileImage || "https://via.placeholder.com/100"} 
            alt={tutor.name} 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
        </div>
        <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-white dark:bg-gray-700 px-2 py-1 md:px-3 md:py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-600">
          <span className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${tutor.isOnline ? "bg-green-500" : "bg-gray-300"}`} />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {tutor.isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Tutor Details */}
      <div className="flex-1 space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
            {tutor.name}
          </h2>
          {/* {tutor.isVerified && ( */}
            {/* <FaCheckCircle className="text-blue-500 text-lg mt-1 mx-auto sm:mx-0" /> */}
        {/* //   )} */}
        </div>
        
        <div className="flex flex-wrap gap-y-1 items-center justify-center sm:justify-start gap-2">
          <span className="px-2 py-1 md:px-3 md:py-1 bg-primary/10 text-gray-700 dark:text-gray-300 text-xs md:text-sm rounded-full">
            {tutor.bio || "Tutor"} 
          </span>
          {/* <span className="hidden sm:inline text-gray-500">•</span> */}
          {/* <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
            {tutor.lessonsTaught || "100+"} lessons
          </span> */}
        </div>

        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed text-center sm:text-left">
          {tutor.description || ""}
        </p>

        {/* Subjects */}
        {tutor.subjects?.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {tutor.subjects.slice(0, 4).map((subject, index) => (
              <span 
                key={index} 
                className="bg-primary/80 text-gray-100 dark:text-white text-xs font-medium px-2 py-1 md:px-3 md:py-1.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                {subject}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right Section - Pricing & CTA */}
      <div className="flex flex-col items-center sm:items-end gap-3 md:gap-4 w-full sm:w-48 flex-shrink-0">
        <div className="text-center sm:text-right">
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            ₹{tutor.hourlyRate}
            <span className="text-sm font-normal text-gray-500 ml-1">/hr</span>
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-1 mt-1 md:mt-2">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="text-yellow-400 text-sm md:text-[15px]">
                {index < tutor.rating ? <FaStar /> : <FaRegStar />}
              </span>
            ))}
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 ml-1">
              ({tutor.reviews || "120"})
            </span>
          </div>
        </div>
        
        <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default TutorCardList;
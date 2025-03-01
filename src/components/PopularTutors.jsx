import React from "react";
import Slider from "react-slick";
import TutorCard from "./TutorCard";

const PopularTutors = ({ tutors }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Popular Tutors</h2>
          <p className="text-gray-600 mt-1">Highest rated tutors with exceptional feedback</p>
        </div>
        <button className="text-primary font-medium hover:underline">View All</button>
      </div>
      
      {tutors && tutors.length > 0 ? (
        <div className="relative -mx-4">
          <Slider {...settings} className="popular-tutors-slider">
            {tutors.map((tutor, index) => (
              <div key={index} className="px-4 py-2">
                <div className="h-full transform transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <TutorCard tutor={tutor} />
                </div>
              </div>
            ))}
          </Slider>
          
          {/* Custom navigation buttons for larger screens */}
          <div className="hidden md:block">
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:bg-gray-50 z-10"
              onClick={() => document.querySelector('.popular-tutors-slider .slick-prev').click()}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:bg-gray-50 z-10"
              onClick={() => document.querySelector('.popular-tutors-slider .slick-next').click()}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No popular tutors available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default PopularTutors;
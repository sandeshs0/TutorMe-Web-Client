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
    centerMode: true, // Centers the active slide
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 768, // For mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="mt-4 bg-white rounded-xl shadow-lg px-16 pt-6 pb-16  lg:max-w-6xl md:max-w-xl mx-auto mb-10">
      <h2 className="text-2xl font-poppins font-bold  text-gray-700 mb-3">
        Popular Tutors
      </h2>
      <Slider {...settings}>
        {tutors.map((tutor, index) => (
          <div key={index} className="lg:px-4  my-2">
            <TutorCard tutor={tutor} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PopularTutors;

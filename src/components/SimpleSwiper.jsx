import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SimpleSwiper = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    >
      <SwiperSlide>
        <div className="bg-gray-200 p-8">Slide 1</div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-gray-200 p-8">Slide 2</div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="bg-gray-200 p-8">Slide 3</div>
      </SwiperSlide>
    </Swiper>
  );
};

export default SimpleSwiper;

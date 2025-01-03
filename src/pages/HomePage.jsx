// import React from "react";
// import HeroSection from "../components/HeroSection";
// import Navbar from "../components/Navbar";
// import SortingOptions from "../components/sort";
// import Footer from "../components/Footer";

// const HomePage = () => {
//   return (
//     <div>
//       <Navbar />
//       <HeroSection />
//       <div className="flex justify-center mb-10">
//   <div className="container mx-auto px-4 text-center">
//     <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
//       Your Tutor, Your <mark className="px-2 text-white bg-indigo-700 rounded">Choice</mark>
//     </h1>
//     <p className="text-lg font-normal text-gray-500 lg:text-xl">
//       Find the appropriate match who can not only tutor you but mentor you for life.
//     </p>
//   </div>
// </div>
//       <SortingOptions />
//       <Footer/>
//       <Footer/>
//       <Footer/>
//       <Footer/>
//       <Footer/>

//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import SortingOptions from "../components/sort";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import SearchSection from "../components/SearchBar";


const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <HeroSection />
      <div className="flex justify-center mb-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-neutral md:text-5xl lg:text-6xl">
            Your Tutor, Your <mark className="px-2 text-white bg-primary rounded">Choice</mark>
          </h1>
          <p className="text-lg font-normal text-gray-500 lg:text-xl">
            Find the appropriate match who can not only tutor you but mentor you for life.
          </p>
        </div>
      </div>
      {/* <SortingOptions /> */}
      <SearchSection />
      <Footer />
    </div>
  );
};

export default HomePage;

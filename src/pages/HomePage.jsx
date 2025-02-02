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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import PopularTutors from "../components/PopularTutors";
import SearchSection from "../components/SearchBar";
import { fetchTutors } from "../services/api"; // Import API function
import PaginatedTutors from "../components/PaginatedTutors";
import tutorsRandom from "../test_data/tutor";

const HomePage = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]); // State for tutors
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    const loadTutors = async () => {
      try {
        setLoading(true);
        const response = await fetchTutors();
        setTutors(response.tutors);
      } catch (err) {
        setError(err.message || "Failed to fetch tutors.");
      } finally {
        setLoading(false);
      }
    };
    loadTutors();
  }, []);
  console.log(tutors);

  // const s = [
  //   {
  //     name: "Er. Ramesh Silwal",
  //     experience: "6 years",
  //     expertise: ["JavaScript", "Python", "Java", "Mathematics", "AI/ML"],
  //     hourlyRate: 350,
  //     rating: 5,
  //     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     name: "Nikesh Bhandari",
  //     experience: "3 years",
  //     expertise: ["JavaScript", "Python", "Java", "Mathematics", "AI/ML"],
  //     hourlyRate: 150,
  //     rating: 4,
  //     image: "https://m.media-amazon.com/images/M/MV5BOGJkMzRiYmQtOTVjNy00MWU3LTg5YjctNjcwMmZlNGIwMjhmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  //   },
  //   {
  //     name: "Bisakha Chaudhary",
  //     experience: "6 years",
  //     expertise: ["JavaScript", "Python", "Java", "Mathematics", "AI/ML"],
  //     hourlyRate: 350,
  //     rating: 4,
  //     image: "https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  // ];

  return (
    <div>
      <Navbar />
      <HeroSection />
      <div className="flex justify-center mb-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-neutral md:text-5xl lg:text-6xl">
            Your Tutor, Your{" "}
            <mark className="px-2 text-white bg-primary rounded">Choice</mark>
          </h1>
          <p className="text-lg font-normal text-gray-500 lg:text-xl">
            Find the appropriate match who can not only tutor you but mentor you
            for life.
          </p>
        </div>
      </div>
      {/* <SortingOptions /> */}
      <SearchSection />
      <div>
        {loading ? (
          <div className="text-center text-gray-600">Loading tutors...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <PopularTutors tutors={tutors} />
        )}
      </div>
      <PaginatedTutors itemsPerPage={6} />

      <Footer />
    </div>
  );
};

export default HomePage;

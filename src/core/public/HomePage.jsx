import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import PaginatedTutors from "../../components/PaginatedTutors";
import PopularTutors from "../../components/PopularTutors";
import SearchSection from "../../components/SearchBar";
import { fetchTutors } from "../../services/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-800 md:text-5xl">
            Your Tutor, Your{" "}
            <span className="px-2 text-white bg-primary rounded">Choice</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Find the perfect match who can not only tutor you but mentor you for life.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-16">
          <SearchSection />
        </div>
        
        <div className="mb-16">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">{error}</div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <PopularTutors tutors={tutors} />
            </div>
          )}
        </div>
        
        {/* All Tutors Section */}
        {/* <div className="bg-white rounded-xl shadow-md p-6 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Tutors</h2>
          <PaginatedTutors itemsPerPage={6} />
        </div> */}
        
        {/* Testimonials Section (New) */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-medium">Student Name</h3>
                    <p className="text-sm text-gray-600">Subject: Mathematics</p>
                  </div>
                </div>
                <p className="italic text-gray-700">"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero."</p>
                <div className="flex text-yellow-400 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary text-white rounded-xl shadow-md p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">Join thousands of students who are already achieving their academic goals with our expert tutors.</p>
          <button 
            className="px-8 py-3 bg-white text-primary font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            onClick={() => navigate("/signup")}
          >
            Sign Up Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative p-14 bg-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute right-0 bottom-0 -mb-48 -mr-48 lg:mb-0 lg:mr-0">
          <svg className="w-96 h-96 text-primary" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" opacity="0.3" />
          </svg>
        </div>
        <div className="absolute left-0 top-0 -mt-48 -ml-48 lg:mt-0 lg:ml-0">
          <svg className="w-96 h-96 text-primary" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" opacity="0.3" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 leading-tight">
              Expert Tutoring 
              <span className="block text-primary mt-2">anytime, anywhere</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
              Connect with top-rated tutors instantly, clear your doubts, and excel in your studies with personalized learning sessions.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Get Started
              </button>
              
              <button 
                onClick={() => navigate("/browse")}
                className="button px-8 py-4 bg-white text-primary font-bold rounded-lg shadow border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Browse Tutors
              </button>
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white">
                    <img src={`src/assets/userhead${i}.jpeg`} alt={`Student ${i}`} className="w-10 h-10 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">Join 2,000+ students</p>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 p-4 ">
              <img
                src="src/assets/illustration.png"
                alt="Online Tutoring"
                className="w-full rounded-lg"
              />
            </div>
            
            
            
            <div className="absolute animate-[bounce_4s_infinite] -bottom-6 -right-6 bg-green-500 text-white p-4 rounded-lg shadow-lg z-20 hidden lg:block">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-bold">24/7</span>
              </div>
              <p className="text-sm">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
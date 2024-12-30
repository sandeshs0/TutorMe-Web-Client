import React from "react";

const HeroSection = () => {
    const steps = [
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0-1.104.896-2 2-2h.002a2 2 0 1 1 0 4H10.002c-.555 0-1-.448-1-1 0-.553.447-1 1-1h2.001zM12 19a7 7 0 1 0-7-7"
              />
            </svg>
          ),
          title: "Create Account",
          description: "First you have to create an account here",
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16l2 2l6-6"
              />
            </svg>
          ),
          title: "Select a Tutor",
          description: "Select a suitable tutor",
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v2m0 6.5h7m2 6.5H3l3-6m3 3h3"
              />
            </svg>
          ),
          title: "Schedule a Session",
          description: "Book a session at mutual convenience",
        },
      ];
    
  return (
    <div>
    <div className="hero min-h-screen  flex items-center justify-center px-6">
      <div className="hero-content flex-col lg:flex-row w-full max-w-7xl">
        {/* Left Content */}
        <div className="text-left lg:w-1/2 font-raleway">
          <h1 className="text-6xl font-black text-gray-800">
            Expert Tutoring <br />
            <span className="text-4xl text-[#003FA4]">anytime, anywhere!</span>
          </h1>
          <p className="py-6 text-xl font-poppins text-gray-600">
            Book a session with our tutors and clear your doubts instantly.
          </p>
          <div className="flex items-center space-x-4 mt-8">
            <button className="btn font-poppins font-normal text-xl btn-primary bg-[#1E88E5] text-white px-6 py-2 rounded-xl">
              Explore Tutors
            </button>
            <div className="flex items-center bg-white shadow-md rounded-xl px-5 py-3 w-80">
              <input
                type="text"
                placeholder="Search by subjects"
                className="flex-1 outline-none text-gray-700"
              />
              <button className="text-[#003FA4]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="lg:w-1/2">
          <img
            src="src/assets/illustration.png"
            alt="Tutoring Illustration"
            className="max-w-full"
          />
        </div>
      </div>
      {/* <StepsSection /> */}
      
    </div>

    </div>
  );
};

export default HeroSection;

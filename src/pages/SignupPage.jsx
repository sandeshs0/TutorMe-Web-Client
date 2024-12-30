import React, { useState } from "react";
import Footer from "../components/Footer";

const SignupPage = () => {
  const [isStudent, setIsStudent] = useState(true);

  return (
    <div className="relative">
      {/* Logo in the top-left corner */}
      <div className="flex justify-center top-4">
        <img src="src/assets/logo.png" alt="Logo" className="h-16" />
      </div>

      {/* Page Content */}
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center px-4 mt-5 py-4">
        {/* Card Container */}
        <div className="bg-white shadow-md rounded-2xl max-w-5xl w-full p-4">
        <h1 className="flex font-poppins text-3xl font-bold items-center justify-center text-gray-800 p-4">Sign Up as a</h1>

          {/* Toggle Buttons */}
          <div className="flex justify-center  items-center font-poppins bg-[#9CBDF2] rounded-xl p-1.5 mb-6 w-[300px] mx-auto">
            <button
              onClick={() => setIsStudent(true)}
              className={`flex-1 text-center px-4 py-2  rounded-xl font-medium transition ${
                isStudent ? "bg-[#003FA4] text-white" : "text-blue-900"
              }`}
            >
              As a Student
            </button>
            <button
              onClick={() => setIsStudent(false)}
              className={`flex-1 text-center px-4 py-2 rounded-xl font-medium transition ${
                !isStudent ? "bg-[#003FA4] text-white" : "text-blue-900"
              }`}
            >
              As a Tutor
            </button>
          </div>

          {/* Two Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Section - Form */}
            <div className="p-8 lg:p-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {isStudent ? "Student Signup" : "Tutor Signup"}
              </h1>

              {/* Student Form */}
              {isStudent && (
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullname"
                      className="block text-sm text-gray-600"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      placeholder="Enter Your Full Name"
                      className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter Your Email"
                      className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm text-gray-600"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="98XXXXXXXX"
                      className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm text-gray-600"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="***************"
                      className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm text-gray-600"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      placeholder="***************"
                      className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                  >
                    Sign Up
                  </button>
                </form>
              )}

              {!isStudent && (
                <div>
                  <p className="text-gray-600">Tutor signup form coming soon!</p>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center justify-center bg-transparent rounded-r-2xl">
              <img
                src="src/assets/student_signup_illus.png"
                alt="Signup Illustration"
                className="max-full"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupPage;

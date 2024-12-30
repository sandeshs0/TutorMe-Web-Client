import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LoginPage = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      {/* <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-3xl"></div> */}

      {/* Page Content */}
      <div className="relative flex items-center justify-center min-h-screen bg-[#F8FAFC] px-4 mt-4">
        {/* Background Shape */}

        {/* Login Card */}
        <div className="relative bg-white shadow-md rounded-2xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section - Form */}
          <div className="p-8 lg:p-12">
            <h1 className="text-3xl font-bold text-gray-800">WELCOME BACK</h1>
            <p className="text-gray-500 mt-2">
              Welcome back! Please enter your details.
            </p>

            <form className="mt-6 space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              {/* Password Input */}
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
                  placeholder="********"
                  className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2 rounded border-gray-300"
                  />
                  <label htmlFor="remember" className="text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-blue-500 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Sign
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <a href="#" className="text-blue-500 font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </div>

          {/* Right Section - Illustration */}
          <div className="hidden lg:flex items-center justify-center bg-transparent rounded-r-2xl">
            <img
              src="src/assets/loginIllus.png"
              alt="Login Illustration"
              className="w-full"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;

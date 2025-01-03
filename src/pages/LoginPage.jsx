import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";


const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  
  return (
    <div>

      {/* <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-3xl"></div> */}

      {/* Page Content */}
      <div className="relative flex items-center justify-center min-h-screen bg-[#F8FAFC] px-4">
        {/* Background Shape */}

        {/* Login Card */}
        <div className="relative bg-white shadow-md rounded-2xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2">
        <button
        className="absolute top-0 right-0 font-thin text-gray-100 text-2xl bg-red-800 px-4 py-1 hover:bg-red-600 focus:outline-none z-50"
        onClick={() => navigate("/")}
        // aria-label="Close"
      >
<i class="fas fa-xmark"></i>
      </button>
          {/* Left Section - Form */}
       
          <div className="p-8 lg:p-12">
            <h1 className="text-3xl font-bold font-poppins  text-gray-800">WELCOME BACK</h1>
            <p className="text-gray-500 mt-2 font-poppins">
              Welcome back! Please enter your details.
            </p>

            <form className="mt-6 space-y-6 font-poppins ">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-md text-gray-800 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full mt-1 p-3 border text-black rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-md text-gray-800 font-semibold"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="********"
                  className="w-full mt-1 p-3 text-black border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
<button
                  type="button"
                  className="absolute top-9 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash"></i> // Eye-slash icon for "hide"
                  ) : (
                    <i className="fas fa-eye"></i> // Eye icon for "show"
                  )}
                </button>

              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between text-sm lg:text-md font-poppins">
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
                className="btn w-full bg-blue-500 text-white py-3 text-xl font-poppins rounded-lg shadow-md hover:bg-blue-600 focus:outline-none "
              >
                Login
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center font-poppins text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-500 font-medium hover:underline">
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
    </div>
  );
};

export default LoginPage;

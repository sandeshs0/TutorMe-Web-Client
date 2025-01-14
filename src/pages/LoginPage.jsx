import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { loginUser } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // Import AuthContext


const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login method from AuthContext
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [formData, setFormData] = useState({
    email:"",
    password:"",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  //validation schema with yup
  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required"),
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin=async(e)=>{
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try{
      // Validate form data with Yup schema
      await validationSchema.validate(formData, { abortEarly: false });

      // Call the loginUser function from the API
      const response = await loginUser(formData);
      // Call the login method from AuthContext
      login(response.user);
      // Redirect based on user role
    if (response.user.role === "student") {
      navigate("/");
      toast.success("Login successful", { position: "bottom-right" });
    } else if (response.user.role === "tutor") {
      navigate("/tutor-dashboard");
      toast.success("Login successful as Tutor", { position: "bottom-right" });
      toast.info("Redirecting to dashboard...", { position: "bottom-right" });
    }


    }catch(err){
      if (err.name==="ValidationError"){
        const validationErrors = {};
        err.inner.forEach(({ path, message }) => {
          validationErrors[path] = message;
        });
        setErrors(validationErrors);
    }else{
      toast.error(err.message || "Login failed. Please try again.");
      setErrors({ general: err.message || "Login failed. Please try again." });
    }
  }finally{
    setIsSubmitting(false);
  }
  };
  
  return (
    <div>

      {/* <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-3xl"></div> */}

      {/* Page Content */}
      <div className="relative flex items-center justify-center min-h-screen bg-[#F8FAFC] px-4">
        {/* Background Shape */}

        {/* Login Card */}
        <div className="relative bg-white shadow-md rounded-2xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2">
        <button
        className="absolute font-poppins opacity-100 hover:opacity-100 top-3 right-3 font-thin text-red-300 hover:text-red-500 text-3xl hover:bg-red-100 px-3 rounded-md py-2 bg-transparent focus:outline-none z-50"
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

            <form className="mt-6 space-y-6 font-poppins" onSubmit={handleLogin}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-md text-gray-800 font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full mt-1 p-3 border text-black rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
                
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
    </div>
  );
};

export default LoginPage;

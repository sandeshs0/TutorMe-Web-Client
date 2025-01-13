import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import OtpModal from "../components/OtpModal"; // Import the OTP modal
import { registerUser, resendOtp, verifyEmail } from "../services/api";

const SignupPage = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // Step tracker for Tutor Signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    description: "",
    hourlyRate: "",
    subjects: "",
  }); // Common form data for Student/Tutor
  const [error, setError] = useState(""); // Error message state
    const [success, setSuccess] = useState(""); // Success message state

  
    const [otp, setOtp] = useState(""); // OTP state
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false); // OTP modal state
    const handleOtpChange = (e) => {
      setOtp(e.target.value);
    };
    const [resendCooldown, setResendCooldown] = useState(0); // Resend OTP cooldown state

  const navigate = useNavigate();
    
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form state
  };

  const handleStudentSignup = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: "student", // Role is fixed to "student" for this form
    };
    try {
      const response = await registerUser(payload); // Call API
      setSuccess(response.message); // Show success message
      setIsOtpModalVisible(true); // Show OTP modal
      setResendCooldown(60); // Set cooldown to 30 seconds
      startCooldown(); // Start cooldown timer

    } catch (err) {
      setError(err.message || "An error occurred. Please try again."); // Show error message
    }
  };
  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await verifyEmail({ email: formData.email, otp }); // Call OTP verification API
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login page
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    }
  };
  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await resendOtp({ email: formData.email }); // Call resend OTP API
      setSuccess("OTP has been resent to your email.");
      setResendCooldown(30); // Reset cooldown to 30 seconds
      startCooldown(); // Restart cooldown timer
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    }
  };
  const startCooldown = () => {
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop the timer
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Decrement cooldown every second
  };

  const handleTutorSignup = async () => {
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: "tutor",
      bio: formData.bio,
      description: formData.description,
      hourlyRate: formData.hourlyRate,
      subjects: formData.subjects.split(",").map((subject) => subject.trim()),
    };

    try {
      const response = await registerUser(payload);
      setSuccess(response.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };


  // Functions for navigation in the multistep flow
  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };


  return (
    <div>
      <div className="min-h-screen flex flex-col items-center px-4 py-4 font-poppins">
        {/* Card Container */}
        <div className="relative bg-white shadow-md rounded-2xl max-w-5xl w-full p-4">
          <button
            className="absolute top-0 right-0 font-thin text-gray-100 text-2xl bg-red-800 px-4 py-1 hover:bg-red-600 focus:outline-none z-50"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-xmark"></i>
          </button>

          <h1 className="flex font-poppins text-3xl font-bold items-center justify-center text-gray-800 p-4">
            Sign Up as a
          </h1>

          {/* Toggle Buttons */}
          <div className="flex justify-center items-center font-poppins bg-[#9CBDF2] rounded-xl p-1.5 w-[300px] mx-auto">
            <button
              onClick={() => setIsStudent(true)}
              className={`flex-1 text-center px-4 py-2 rounded-xl font-medium transition ${
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

          <div className="grid grid-cols-1">
            <div className="p-8 lg:p-12">
              {isStudent && (
                <form onSubmit={handleStudentSignup} className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullname"
                      className="block text-md text-gray-800 font-semibold"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="name"
                      onChange={handleInputChange}
                      value={formData.name}
                  required
                      placeholder="Enter Your Full Name"
                      className="w-full mt-1 p-3 border text-black rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-md text-gray-800 font-semibold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={handleInputChange}
                      value={formData.email}
                  required
                      placeholder="Enter Your Email"
                      className="w-full mt-1 p-3 text-black border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-md text-gray-800 font-semibold"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      onChange={handleInputChange}
                      value={formData.phone}
                  required
                      placeholder="98XXXXXXXX"
                      className="w-full text-black mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-md text-gray-800 font-semibold"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={handleInputChange}
                      value={formData.password}
                  required
                      placeholder="***************"
                      className="w-full text-black mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-md text-gray-800 font-semibold"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      placeholder="***************"
                      name="confirmPassword"
                      onChange={handleInputChange}
                      value={formData.confirmPassword}
                  required

                      className="w-full text-black mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  {success && <p className="text-green-500">{success}</p>}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-xl text-white py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                  >
                    Sign Up
                  </button>
                </form>
              )}

              {!isStudent && (
                <div>
                  {/* Step Indicator */}
                  <div className="flex items-center justify-between w-full mb-8">
  <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
    <li
      className={`flex items-center md:w-full ${
        currentStep >= 1 ? "text-blue-600" : "text-gray-400"
      }`}
    >
      <span className="flex items-center">
        <span
          className={`flex items-center justify-center w-8 h-6 rounded-full text-sm font-medium ${
            currentStep >= 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          1
        </span>
        <span className="ml-2 text-sm font-normal">Personal Info</span>
      </span>
      <span
        className={`hidden md:block w-1/3 h-0.5 ${
          currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"
        } mx-4`}
      ></span>
    </li>
    <li
      className={`flex items-center md:w-full ${
        currentStep >= 2 ? "text-blue-600" : "text-gray-400"
      }`}
    >
      <span className="flex items-center">
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep >= 2
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          2
        </span>
        <span className="ml-2 font-semibold">Account Info</span>
      </span>
      <span
        className={`hidden md:block w-full h-0.5 ${
          currentStep >= 3 ? "bg-blue-500" : "bg-gray-200"
        } mx-4`}
      ></span>
    </li>
    <li
      className={`flex items-center ${
        currentStep >= 3 ? "text-blue-600" : "text-gray-400"
      }`}
    >
      <span className="flex items-center">
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            currentStep >= 3
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          3
        </span>
        <span className="ml-2 font-semibold">Confirmation</span>
      </span>
    </li>
  </ol>
</div>


                  {/* Step Content */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Name
                          </label>
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="abc@example.com"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="977XXXXXXXXX"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Profession (if applies)
                          </label>
                          <input
                            type="text"
                            placeholder="E.g: Data Scientist"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          />
                        </div>
                      </form>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">About Yourself</h2>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Bio
                          </label>
                          <textarea
                            rows="4"
                            placeholder="Write about yourself in a few words..."
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Something you can talk about without getting bored
                          </label>
                          <textarea
                            rows="4"
                            placeholder="E.g: Cricket, holiday destinations, favorite movies"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Your Hobbies
                          </label>
                          <textarea
                            rows="4"
                            placeholder="Write your hobbies here"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          ></textarea>
                        </div>
                      </form>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Let's Talk Numbers and Stats</h2>
                      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Years of Experience
                          </label>
                          <input
                            type="text"
                            placeholder="E.g: 5 years"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Hourly Rate (Nrs)
                          </label>
                          <input
                            type="text"
                            placeholder="E.g: 500"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-600">
                            Fields of Expertise (Tags)
                          </label>
                          <input
                            type="text"
                            placeholder="E.g: Mathematics, Science, Programming"
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm"
                          />
                        </div>
                      </form>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-green-600 mb-4">
                        Tutor Registered Successfully
                      </h2>
                      <p className="text-gray-600">
                        Thank you for registering. Click the button below to navigate to the
                        login page.
                      </p>
                      <button
                        onClick={handleComplete}
                        className="bg-blue-500 text-white px-6 py-2 mt-4 rounded-lg shadow-sm"
                      >
                        Back to Login
                      </button>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <button
                        onClick={handlePreviousStep}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                      >
                        Previous Step
                      </button>
                    )}
                    {currentStep < 4 && (
                      <button
                        onClick={handleNextStep}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Next Step
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

{/* OTP Modal */}
{/* {isOtpModalVisible && ( */}
        <OtpModal
          otp={otp}
          setOtp={setOtp}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          resendCooldown={resendCooldown}
          error={error}
          success={success}
          closeModal={() => setIsOtpModalVisible(false)}
        />
      {/* )} */}

      <Footer />
    </div>
  );
};

export default SignupPage;

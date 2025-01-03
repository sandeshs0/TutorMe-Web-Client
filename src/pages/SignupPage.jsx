import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const SignupPage = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // Step tracker for Tutor Signup

  const navigate = useNavigate();

  // Functions for navigation in the multistep flow
  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleComplete = () => {
    alert("Tutor registration complete!");
    navigate("/login");
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
                <form className="space-y-4">
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
                      className="w-full text-black mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                    />
                  </div>

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

      <Footer />
    </div>
  );
};

export default SignupPage;

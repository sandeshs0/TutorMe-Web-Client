import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SubjectsInput from "../../components/SubjectField";
import { registerUser, resendOtp, verifyEmail } from "../../services/api";

const SignupPage = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Step tracker for Tutor Signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    bio: "",
    description: "",
    hourlyRate: "",
    subjects: [],
  }); // Common form data for Student/Tutor
  const [otp, setOtp] = useState(""); // OTP state
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false); // Success modal state
  const [error, setError] = useState(""); // Error message state
  const [success, setSuccess] = useState(""); // Success message state
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for API calls

  const isStrongPassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handlePasswordStrength = (password) => {
    const strengthLevels = {
      weak: "Too weak",
      moderate: "Moderate",
      strong: "Strong",
    };

    let strength = strengthLevels.weak;
    const conditions = [
      /[a-z]/.test(password), // Lowercase
      /[A-Z]/.test(password), // Uppercase
      /\d/.test(password), // Number
      /[@$!%*?&]/.test(password), // Special character
    ];

    const validConditions = conditions.filter((condition) => condition).length;

    if (password.length >= 8 && validConditions >= 4) {
      strength = strengthLevels.strong;
    } else if (password.length >= 8 && validConditions >= 2) {
      strength = strengthLevels.moderate;
    }

    setPasswordStrength(strength);
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form state
  };

  const handleStudentSignup = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError("");
    setSuccess("");
    setIsSubmitting(true); // Show loading animation

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
      username: formData.username,
      role: "student", // Role is fixed to "student" for this form
    };
    try {
      const response = await registerUser(payload); // Call API
      setSuccess(response.message); // Show success message
      toast.success("User Registered successfully", {
        position: "bottom-right",
      });
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (err) {
      setError(err.message || "An error occurred. Please try again."); // Show error message
      toast.error("An Error Occurred.", { position: "bottom-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTutorSignup = async () => {
    setError("");
    setSuccess("");
    if (!validateStep()) {
      return;
    }
    setIsSubmitting(true); // Show loading animation

    // Validate passwords match

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      username: formData.username,
      role: "tutor",
      bio: formData.bio,
      description: formData.description,
      hourlyRate: formData.hourlyRate,
      subjects: formData.subjects,
    };

    try {
      const response = await registerUser(payload);
      setSuccess(response.message);
      setCurrentStep(4);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerification = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await verifyEmail({ email: formData.email, otp }); // Call OTP verification API
      setShowModal(true); // Show success modal
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      // Call your resend OTP API here
      await resendOtp({ email: formData.email });
      setSuccess("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Functions for navigation in the multistep flow
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name) newErrors.name = "Name is required.";
      if (!formData.email) {
        newErrors.email = "Email is required.";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Invalid email format.";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required.";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be 10 digits.";
      }
    }

    if (currentStep === 2) {
      if (!formData.bio) newErrors.bio = "Bio is required.";
      if (!formData.description)
        newErrors.description = "Description is required.";
      if (!formData.hourlyRate)
        newErrors.hourlyRate = "Hourly rate is required.";
      else if (isNaN(formData.hourlyRate) || formData.hourlyRate <= 0) {
        newErrors.hourlyRate = "Hourly rate must be a positive number.";
      }
      if (formData.subjects.length === 0) {
        newErrors.subjects = "Please add at least one subject.";
      }
    }

    if (currentStep === 3) {
      if (!formData.password) newErrors.password = "Password is required.";
      if (!isStrongPassword(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
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
            className="absolute font-poppins opacity-100 hover:opacity-100 top-3 right-3 font-thin text-red-300 hover:text-red-500 text-3xl hover:bg-red-100 px-3 rounded-md py-2 bg-transparent focus:outline-none z-50"
            onClick={() => navigate("/")}
            // aria-label="Close"
          >
            <i class="fas fa-xmark"></i>
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
                      htmlFor="fullname"
                      className="block text-md text-gray-800 font-semibold"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      onChange={handleInputChange}
                      value={formData.username}
                      required
                      placeholder="Choose a username"
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                  </button>
                </form>
              )}
              {/* Tutor Registration Part: */}
              {!isStudent && (
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                  {/* Step Indicator */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                              currentStep >= step
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {step}
                          </div>
                          <span
                            className={`mt-2 text-sm ${
                              currentStep >= step
                                ? "text-blue-600 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {step === 1 && "Personal Info"}
                            {step === 2 && "About Yourself"}
                            {step === 3 && "Set Password"}
                            {step === 4 && "Confirmation"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center">
                      <div
                        className={`h-1 flex-1 ${
                          currentStep > 1 ? "bg-blue-500" : "bg-gray-200"
                        } transition-all`}
                      ></div>
                      <div
                        className={`h-1 flex-1 ${
                          currentStep > 2 ? "bg-blue-500" : "bg-gray-200"
                        } transition-all`}
                      ></div>
                      <div
                        className={`h-1 flex-1 ${
                          currentStep > 3 ? "bg-blue-500" : "bg-gray-200"
                        } transition-all`}
                      ></div>
                    </div>
                  </div>

                  {/* State for form data and errors */}
                  <form className="space-y-6 text-black">
                    {currentStep === 1 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-blue-700">
                          Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              placeholder="Full Name"
                              className={`w-full mt-2 p-3  border ${
                                errors.name
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
                              value={formData.name}
                              onChange={handleInputChange} // Pass the event object directly
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm">
                                {errors.name}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              placeholder="abc@example.com"
                              className={`w-full mt-2 p-3 border ${
                                errors.email
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
                              value={formData.email}
                              onChange={handleInputChange} // Pass the event object directly
                            />
                            {errors.email && (
                              <p className="text-red-500 text-sm">
                                {errors.email}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              placeholder="977XXXXXXXXX"
                              name="phone"
                              className={`w-full mt-2 p-3 border ${
                                errors.phone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
                              value={formData.phone}
                              onChange={handleInputChange} // Pass the event object directly
                            />
                            {errors.phone && (
                              <p className="text-red-500 text-sm">
                                {errors.phone}
                              </p>
                            )}
                          </div>
                          {/* <div>
              <label className="block text-sm font-medium text-gray-600">
                Profession (if applies)
              </label>
              <input
                type="text"
                name="profession"
                placeholder="E.g: Data Scientist"
                className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                value={formData.profession}
                onChange={handleInputChange}
                />
            </div> */}
                        </div>
                      </div>
                    )}

                    {/* Other Steps */}
                    {currentStep === 2 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-blue-700">
                          About Yourself
                        </h2>
                        {/* Add fields for step 2 */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-md font-medium text-gray-900">
                              Bio
                            </label>
                            <textarea
                              name="bio"
                              placeholder="Write about yourself in a few words..."
                              className={`w-full mt-2 p-3 border ${
                                errors.bio
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
                              value={formData.bio}
                              onChange={handleInputChange}
                              rows="4"
                            ></textarea>
                            {errors.bio && (
                              <p className="text-red-500 text-sm">
                                {errors.bio}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-md font-medium text-gray-900">
                              Description
                            </label>
                            <textarea
                              name="description"
                              placeholder="Describe your teaching style, experience, and areas of expertise."
                              className={`w-full mt-2 p-3 border ${
                                errors.description
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
                              value={formData.description}
                              onChange={handleInputChange}
                              rows="4"
                            ></textarea>
                            {errors.description && (
                              <p className="text-red-500 text-sm">
                                {errors.description}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-md font-medium text-gray-900">
                              Hourly Rate
                            </label>
                            <input
                              type="number"
                              name="hourlyRate"
                              placeholder="Enter your hourly rate NRs"
                              className={`w-full mt-2 p-3 border ${
                                errors.hourlyRate
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
                              value={formData.hourlyRate}
                              onChange={handleInputChange}
                            />
                            {errors.hourlyRate && (
                              <p className="text-red-500 text-sm">
                                {errors.hourlyRate}
                              </p>
                            )}
                          </div>

                          <div>
                            {/* <label className="block text-sm font-medium text-gray-600">Subjects</label>
        <input
          type="text"
          name="subjects"
          placeholder="Enter subjects separated by commas, e.g., Math, Physics, Chemistry"
          className={`w-full mt-2 p-3 border ${
            errors.subjects ? "border-red-500" : "border-gray-300"
          } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
          value={formData.subjects}
          onChange={handleInputChange}
        /> */}
                            <SubjectsInput
                              formData={formData}
                              setFormData={setFormData}
                              errors={errors}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* {currentStep === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Confirmation</h2>
        </div>
      )} */}
                    {currentStep === 3 && (
                      <div>
                        <h2 className="text-2xl font-bold mb-4 text-blue-700">
                          Set Your Password
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                          Please create a secure password including the
                          following criteria:
                          <ul className="list-disc pl-5 mt-2">
                            <li>Lowercase letters</li>
                            <li>Numbers</li>
                            <li>Capital letters</li>
                            <li>Special characters</li>
                          </ul>
                        </p>
                        <div className="space-y-4 ">
                          {/* Password Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                type={isPasswordVisible ? "text" : "password"} // Toggle between "text" and "password"
                                name="password"
                                placeholder="Your strong password..."
                                className={`w-full mt-2 p-3 border ${
                                  errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
                                value={formData.password}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  handlePasswordStrength(e.target.value);
                                }}
                              />
                              <span
                                className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                                onClick={togglePasswordVisibility}
                              >
                                <i
                                  className={
                                    isPasswordVisible
                                      ? "fas fa-eye-slash"
                                      : "fas fa-eye"
                                  }
                                ></i>
                              </span>
                            </div>
                            {errors.password && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors.password}
                              </p>
                            )}
                            {/* Password Strength Bar */}
                            <div className="mt-2">
                              <div className="h-2 w-full bg-gray-200 rounded">
                                <div
                                  className={`h-full rounded transition-all ${
                                    passwordStrength === "Too weak"
                                      ? "bg-red-500 w-1/4"
                                      : passwordStrength === "Moderate"
                                      ? "bg-yellow-500 w-2/4"
                                      : passwordStrength === "Strong"
                                      ? "bg-green-500 w-full"
                                      : "bg-gray-200"
                                  }`}
                                ></div>
                              </div>
                              <p
                                className={`mt-1 text-sm font-medium ${
                                  passwordStrength === "Too weak"
                                    ? "text-red-500"
                                    : passwordStrength === "Moderate"
                                    ? "text-yellow-500"
                                    : passwordStrength === "Strong"
                                    ? "text-green-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {passwordStrength}
                              </p>
                            </div>
                          </div>

                          {/* Confirm Password Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              placeholder="********"
                              className={`w-full mt-2 p-3 border ${
                                errors.confirmPassword
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg shadow-sm focus:ring focus:ring-blue-200`}
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                            />
                            {errors.confirmPassword && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors.confirmPassword}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-blue-700">
                          Verify Your Email
                        </h2>
                        <p className="text-gray-600">
                          Enter the OTP sent to{" "}
                          <span className="font-medium">{formData.email}</span>.
                        </p>

                        {/* OTP Inputs */}
                        <div className="flex justify-center space-x-2">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              className="w-12 h-14 text-gray-950 font-extrabold text-center border hover:border-blue-500  bg-blue-100 text-xl  rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  const newOtp = otp.split("");
                                  newOtp[index] = value;
                                  setOtp(newOtp.join(""));
                                  // Move focus to next input if not empty
                                  if (value !== "" && index < 5) {
                                    e.target.nextSibling?.focus();
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Backspace" &&
                                  !e.target.value &&
                                  index > 0
                                ) {
                                  e.target.previousSibling?.focus();
                                }
                              }}
                              value={otp[index] || ""}
                            />
                          ))}
                        </div>

                        {error && (
                          <p className="text-red-500 text-center">{error}</p>
                        )}
                        {success && (
                          <p className="text-green-500 text-center mb-2">
                            {success}
                          </p>
                        )}

                        {/* Verify Button */}
                        <button
                          onClick={handleOtpVerification}
                          className="w-full btn flex justify-center bg-blue-700 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Verifying..." : "Verify"}
                        </button>
                        {/* Resend Option */}
                        <div className="text-center">
                          <p className="text-gray-600">
                            Didn't get a code?{" "}
                            <button
                              onClick={handleResendOtp}
                              className="text-blue-600 font-medium  hover:underline disabled:text-gray-400"
                              disabled={isSubmitting}
                            >
                              Resend
                            </button>
                          </p>
                        </div>
                      </div>
                    )}

                    {showModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                          <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
                          <h3 className="text-xl font-bold mb-4">
                            Welcome Onboard!
                          </h3>
                          <p className="text-gray-600  text-left"></p>
                          <p className="text-gray-600 text-lg">
                            Your tutor account has been created successfully.
                            <span className="text-2xl">🥳</span>{" "}
                          </p>
                          <p className="text-gray-600 mb-6 text-lg">
                            Happy Tutoring!
                          </p>
                          <button
                            onClick={() => navigate("/login")}
                            className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800"
                          >
                            Go to Login
                          </button>
                        </div>
                      </div>
                    )}

                    {isSubmitting && (
                      <div Name="flex items-center justify-center h-screen">
                        <div className="relative">
                          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePreviousStep}
                          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-400"
                        >
                          Previous Step
                        </button>
                      )}
                      {currentStep < 3 && (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
                        >
                          Next Step
                        </button>
                      )}

                      {currentStep === 3 && (
                        <button
                          type="button"
                          onClick={handleTutorSignup}
                          className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Signing up..." : "Complete Signup"}
                          <i className="fa fa-paper-plane"></i>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {/* {isOtpModalVisible && ( */}
      {/* <OtpModal
          otp={otp}
          setOtp={setOtp}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          resendCooldown={resendCooldown}
          error={error}
          success={success}
          closeModal={() => setIsOtpModalVisible(false)}
        /> */}
      {/* )} */}
    </div>
  );
};

export default SignupPage;

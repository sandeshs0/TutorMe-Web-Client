import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtp, verifyEmail } from "../../services/api";

const OtpPage = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  if (!email) {
    return <p>Error: Email not provided. Please restart the signup process.</p>;
  }

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");
    const otpValue = otp.join("");

    try {
      const response = await verifyEmail({ email, otp: otpValue });
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await resendOtp({ email });
      setSuccess("OTP has been resent to your email.");
      setResendCooldown(30);
      startCooldown();
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    }
  };

  const startCooldown = () => {
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen font-poppins flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Verify Your Email
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit verification code sent to your email.
        </p>

        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleOtpChange(e.target, index)}
              onFocus={(e) => e.target.select()} 
              className="w-12 h-14 text-gray-950 font-extrabold text-center hover:border bg-blue-50 text-xl  rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-2">{success}</p>
        )}

        <button
          onClick={handleVerifyOtp}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none mb-4"
        >
          Verify Account
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Didn't receive code?{" "}
            <button
              onClick={handleResendOtp}
              className={`text-blue-500 font-semibold ${
                resendCooldown > 0 ? "cursor-not-allowed text-gray-400" : ""
              }`}
              disabled={resendCooldown > 0}
            >
              Resend {resendCooldown > 0 && `(${resendCooldown}s)`}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;

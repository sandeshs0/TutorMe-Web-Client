// File: components/OtpModal.jsx
import React from "react";

const OtpModal = ({ 
  otp, 
  setOtp, 
  onVerify, 
  onResend, 
  resendCooldown, 
  error, 
  success, 
  closeModal 
}) => {
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-sm w-full">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Verify Your Email</h2>
        <p className="text-gray-600 mb-6 text-center">Please enter the OTP sent to your registered email address.</p>

        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring focus:ring-blue-200 mb-4"
        />

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2">{success}</p>}

        <div className="flex justify-between items-center mt-4 space-x-3">
          <button
            onClick={onVerify}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Verify
          </button>

          <button
            onClick={onResend}
            className={`w-full px-4 py-2 rounded-lg shadow-md focus:outline-none ${
              resendCooldown > 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
            disabled={resendCooldown > 0}
          >
            Resend OTP {resendCooldown > 0 && `(${resendCooldown}s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;

import React from "react";
import { PiHandWithdrawFill } from "react-icons/pi";

const TutorWalletCard = ({ name, balance, date, onWithdraw }) => {
  return (
    <div
      className="relative w-full max-w-sm p-6 bg-blue-500 text-white rounded-2xl shadow-lg font-poppins animate-slide-in"
      style={{
        background: "linear-gradient(135deg, #3391D0, #197BBD)",
      }}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold">tutorMe</h2>
        <p className="text-sm text-gray-300">Tutor's Earning Wallet</p>
      </div>

      <div className="text-4xl font-bold mb-20">Rs. {balance}</div>

      <div className="absolute bottom-6 left-6 flex gap-12">
        <div className="flex flex-col">
          <p className="text-xs mb-2 font-medium text-gray-200">Name</p>
          <p className="text-md font-medium">{name}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-xs mb-2 font-medium text-gray-200">As of</p>
          <p className="text-md font-medium">{date}</p>
        </div>
      </div>
      <svg
        className="absolute bottom-0 rounded-lg right-1 w-60 h-40 opacity-100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 100"
        fill="white"
      >
        <path
          d="M105.348 114.814C105.348 143.67 81.9551 167.063 53.0987 167.063C24.2423 167.063 0.849609 143.67 0.849609 114.814C0.849609 99.5995 7.35225 85.9042 17.7299 76.3553C27.0353 67.7929 39.4564 62.5645 53.0987 62.5645C81.9551 62.5645 105.348 85.9572 105.348 114.814Z"
          fill="white"
          fill-opacity="0.12"
        />
        <path
          d="M105.348 114.814C105.348 143.67 81.9551 167.063 53.0987 167.063H203.893C175.037 167.063 151.644 143.67 151.644 114.814C151.644 111.128 152.026 107.531 152.752 104.06C150.291 104.416 147.775 104.6 145.216 104.6C119.855 104.6 98.7143 86.531 93.9648 62.5645H59.8823H53.0987C81.9551 62.5645 105.348 85.9572 105.348 114.814Z"
          fill="white"
          fill-opacity="0.12"
        />
        <path
          d="M93.9648 62.5645C93.3102 59.2613 92.9669 55.8461 92.9669 52.3507C92.9669 47.76 93.559 43.3076 94.6708 39.0657C90.3047 46.8986 77.2344 62.5645 59.8823 62.5645H93.9648Z"
          fill="white"
          fill-opacity="0.12"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M203.893 167.063C232.75 167.063 256.142 143.67 256.142 114.814C256.142 85.9572 232.75 62.5645 203.893 62.5645C201.334 62.5645 198.818 62.7485 196.357 63.1039C191.904 84.3922 174.493 100.92 152.752 104.06C152.026 107.531 151.644 111.128 151.644 114.814C151.644 143.67 175.037 167.063 203.893 167.063Z"
          fill="white"
          fill-opacity="0.12"
        />
        <path
          d="M196.357 63.1039C191.904 84.3922 174.493 100.92 152.752 104.06C157.206 82.772 174.616 66.2446 196.357 63.1039Z"
          fill="white"
          fill-opacity="0.12"
        />
        <path
          d="M197.465 52.3507C197.465 23.4943 174.072 0.101562 145.216 0.101562C120.95 0.101562 100.548 16.6434 94.6708 39.0657C93.559 43.3076 92.9669 47.76 92.9669 52.3507C92.9669 55.8461 93.3102 59.2613 93.9648 62.5645C98.7143 86.531 119.855 104.6 145.216 104.6C147.775 104.6 150.291 104.416 152.752 104.06C157.206 82.772 174.616 66.2446 196.357 63.1039C197.083 59.6336 197.465 56.0367 197.465 52.3507Z"
          fill="white"
          fill-opacity="0.12"
        />
      </svg>
      <button
        className="absolute bottom-5 right-5 px-4 py-2 bg-blue-950 text-white text-2xl font-bold rounded-full hover:bg-blue-800 transition"
        onClick={onWithdraw}
      >
        <PiHandWithdrawFill />
      </button>
    </div>
  );
};

export default TutorWalletCard;

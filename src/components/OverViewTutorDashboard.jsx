import React from "react";
import TutorWalletCard from "./TutorWalletCard";

const OverviewSection = ({ tutorData }) => {
  if (!tutorData) {
    return <p>Loading tutor data...</p>;
  }

  return (
    <div className="flex flex-col  gap-6 p-4">
      {/* Wallet Card */}
      <TutorWalletCard
        name={tutorData.name || "N/A"}
        balance={tutorData.walletBalance || 0}
        date={new Date().toLocaleDateString()}
        onWithdraw={() => alert("Withdraw initiated!")} // Replace with real functionality
      />

      {/* Additional Overview Details */}
      {/* <div className="w-full max-w-4xl mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Quick Overview
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li>
            <span className="font-medium text-gray-700 dark:text-gray-100">
              Total Earnings:
            </span>{" "}
            Rs. {tutorData.walletBalance || 0}
          </li>
          <li>
            <span className="font-medium text-gray-700 dark:text-gray-100">
              Subjects:
            </span>{" "}
            {tutorData.subjects?.length > 0
              ? tutorData.subjects.join(", ")
              : "Not specified"}
          </li>
          <li>
            <span className="font-medium text-gray-700 dark:text-gray-100">
              Rating:
            </span>{" "}
            {tutorData.rating || "No ratings yet"}
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default OverviewSection;

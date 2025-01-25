import React, { useEffect, useState } from "react";
import { getTutors } from "../services/api";
import TutorCard from "./TutorCard"; // Import the TutorCard component

const PaginatedTutorGrid = ({ itemsPerPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tutors, setTutors] = useState([]);
  // Calculate total pages
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  itemsPerPage = 1;
  // Fetch tutors using the API
  const fetchTutors = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTutors(page, itemsPerPage);
      setTutors(data.tutors);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message || "Failed to fetch tutors");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and page change
  useEffect(() => {
    fetchTutors(currentPage);
  }, [currentPage]);

  // Handle pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tutor Grid */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTutorGrid;

import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  FaFilter,
  FaSearch,
  FaStar,
  FaThLarge,
  FaThList,
  FaTimes,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NavbarTwo from "../../components/NavbarTwo";
import SortDropdown from "../../components/SortDropdown";
import TutorCardGrid from "../../components/TutorCard";
import TutorCardList from "../../components/TutorCardList";
import { useAuth } from "../../context/AuthContext";
import { fetchStudentProfile, getTutors } from "../../services/api";

const BrowseTutorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    subject: [],
    priceRange: [0, 5000],
    rating: [0, 5],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const subjectsList = [
    "Math",
    "Science",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Java",
    "Python",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === "student") {
          const profile = await fetchStudentProfile();
          setStudentData(profile);
        }
        const data = await getTutors(
          currentPage,
          6,
          searchQuery,
          filters,
          sortOption
        );
        let sortedTutors = data.tutors;

        // Sorting logic
        // if (sortOption === "price-asc")
        //   sortedTutors.sort((a, b) => a.hourlyRate - b.hourlyRate);
        // if (sortOption === "price-desc")
        //   sortedTutors.sort((a, b) => b.hourlyRate - a.hourlyRate);
        // if (sortOption === "rating")
        //   sortedTutors.sort((a, b) => b.rating - a.rating);
        // if (sortOption === "name")
        //   sortedTutors.sort((a, b) => a.name.localeCompare(b.name));

        setTutors(sortedTutors);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError(err.message || "Failed to fetch tutors");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, sortOption, searchQuery, filters, user]);

  const handleSubjectSelection = (subject) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        subject: prev.subject.includes(subject)
          ? prev.subject.filter((s) => s !== subject)
          : [...prev.subject, subject],
      };
      setCurrentPage(1); // Reset to first page when filters change
      return newFilters;
    });
  };

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <NavbarTwo student={studentData} />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm"
          >
            <FaFilter className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Filters
            </span>
          </button>

          <aside
            className={`bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full lg:w-80 lg:mt-20 transition-all ${
              isDropdownOpen ? "block" : "hidden lg:block"
            }`}
            aria-label="Filter options"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close filters"
              >
                <FaTimes className="text-gray-500 dark:text-gray-400 text-xl" />
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <label htmlFor="tutor-search" className="sr-only">
                Search tutors
              </label>
              <div className="relative">
                <input
                  id="tutor-search"
                  type="text"
                  placeholder="Search tutors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 text-gray-700 ring-2 bg-gray-50 dark:bg-gray-700 rounded-xl ring-gray-300  shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Price Range
                </h3>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  ₹0 - ₹{filters.priceRange[1]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: [0, parseInt(e.target.value)],
                  })
                }
                className="range range-xs w-full accent-blue-600"
                aria-label={`Price range from 0 to ${filters.priceRange[1]} rupees`}
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>₹0</span>
                <span>₹5000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Minimum Rating
                </h3>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mr-1">
                    {filters.rating[0]}
                  </span>
                  <FaStar className="text-yellow-500 text-sm" />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.rating[0]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    rating: [parseFloat(e.target.value), 5],
                  })
                }
                className="range range-xs w-full accent-blue-600"
                aria-label={`Minimum rating of ${filters.rating[0]} stars`}
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>0</span>
                <span>5</span>
              </div>
            </div>

            {/* Subjects Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Subjects
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {subjectsList.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectSelection(subject)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      filters.subject.includes(subject)
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    }`}
                    aria-pressed={filters.subject.includes(subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Subjects */}
            {filters.subject.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected subjects:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filters.subject.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {subject}
                      <button
                        onClick={() => handleSubjectSelection(subject)}
                        className="ml-1.5 text-blue-500 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100 focus:outline-none"
                        aria-label={`Remove ${subject}`}
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Filters Button */}
            {(filters.subject.length > 0 ||
              filters.priceRange[1] < 5000 ||
              filters.rating[0] > 0 ||
              searchQuery.length > 0) && (
              <button
                onClick={() => {
                  setFilters({
                    priceRange: [0, 5000],
                    rating: [0, 5],
                    subject: [],
                  });
                  setSearchQuery("");
                }}
                className="w-full mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Reset All Filters
              </button>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 lg:mt-20">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Browse Tutors
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {tutors.length} tutors available
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <SortDropdown
                    setSortOption={(option) => {
                      setSortOption(option);
                      setCurrentPage(1); // Reset to page 1 when sorting changes
                    }}
                  />

                  <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-3 rounded-xl ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-gray-600 shadow-sm"
                          : ""
                      }`}
                    >
                      <FaThLarge className="text-xl text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-3 rounded-xl ${
                        viewMode === "list"
                          ? "bg-white dark:bg-gray-600 shadow-sm"
                          : ""
                      }`}
                    >
                      <FaThList className="text-xl text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
                }
              >
                {[...Array(6)].map((_, i) =>
                  viewMode === "grid" ? (
                    <Skeleton key={i} height={360} className="rounded-2xl" />
                  ) : (
                    <Skeleton key={i} height={160} className="rounded-2xl" />
                  )
                )}
              </div>
            ) : error ? (
              <div className="alert alert-error shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {tutors.map((tutor) =>
                    viewMode === "grid" ? (
                      <TutorCardGrid key={tutor.id} tutor={tutor} />
                    ) : (
                      <TutorCardList key={tutor.id} tutor={tutor} />
                    )
                  )}
                </div>

                {/* Pagination */}
                <div className="join flex justify-center mt-10">
                  <button
                    data-testid="prev-page-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn btn-outlined disabled:text-gray-700 px-6 py-2"
                  >
                    <CircleChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`join-item btn ${
                        currentPage === index + 1
                          ? "bg-blue-800 text-white"
                          : "btn-outline text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    data-testid="next-page-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="join-item text-white btn btn-outlined disabled:text-gray-700 px-6 py-2"
                  >
                    <CircleChevronRight />
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowseTutorsPage;

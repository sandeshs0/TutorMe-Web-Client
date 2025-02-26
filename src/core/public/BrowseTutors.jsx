import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaFilter, FaThLarge, FaThList, FaTimes } from "react-icons/fa";
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
        const data = await getTutors(currentPage, 6, searchQuery, filters);
        let sortedTutors = data.tutors;

        // Sorting logic
        if (sortOption === "price-asc")
          sortedTutors.sort((a, b) => a.hourlyRate - b.hourlyRate);
        if (sortOption === "price-desc")
          sortedTutors.sort((a, b) => b.hourlyRate - a.hourlyRate);
        if (sortOption === "rating")
          sortedTutors.sort((a, b) => b.rating - a.rating);
        if (sortOption === "name")
          sortedTutors.sort((a, b) => a.name.localeCompare(b.name));

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
    setFilters((prev) => ({
      ...prev,
      subject: prev.subject.includes(subject)
        ? prev.subject.filter((s) => s !== subject)
        : [...prev.subject, subject],
    }));
  };

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <NavbarTwo student={studentData} />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filters Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-sm"
          >
            <FaFilter className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Filters
            </span>
          </button>

          {/* Filters Sidebar */}
          <aside
            className={`lg:block bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full lg:w-80  lg:mt-20
            ${isDropdownOpen ? "block" : "hidden"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="lg:hidden"
              >
                <FaTimes className="text-gray-500 dark:text-gray-400 text-xl" />
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tutors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl  shadow-sm shadow-gray-300 dark:text-white"
              />
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Price Range: ₹0 - ₹{filters.priceRange[1]}
              </h3>
              <input
                type="range"
                min="0"
                max="5000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({ ...filters, priceRange: [0, e.target.value] })
                }
                className="range range-xs w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>₹0</span>
                <span>₹5000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Minimum Rating: {filters.rating[0]}{" "}
                <i className="fas fa-star text-yellow-500"></i>
              </h3>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.rating[0]}
                onChange={(e) =>
                  setFilters({ ...filters, rating: [e.target.value, 5] })
                }
                className="range range-xs w-full"
              />
            </div>

            {/* Subjects Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Subjects
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {subjectsList.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectSelection(subject)}
                    className={`btn btn-sm ${
                      filters.subject.includes(subject)
                        ? "bg-blue-900 text-white dark:bg-blue-900 dark:text-white"
                        : "btn-outline bg-gray-100 text-gray-700 dark:text-gray-50 dark:bg-gray-700"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Subjects */}
            {filters.subject.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filters.subject.map((subject) => (
                    <span
                      key={subject}
                      className="badge badge-primary badge-lg gap-2 pr-3"
                    >
                      {subject}
                      <FaTimes
                        className="cursor-pointer hover:text-red-200"
                        onClick={() => handleSubjectSelection(subject)}
                      />
                    </span>
                  ))}
                </div>
              </div>
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
                  <SortDropdown setSortOption={setSortOption} />
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

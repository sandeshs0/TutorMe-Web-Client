import React, { useEffect, useState } from "react";
import { FaThLarge, FaThList } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NavbarTwo from "../components/NavbarTwo";
import SortDropdown from "../components/SortDropdown"; // Import the new component
import TutorCardGrid from "../components/TutorCard";
import TutorCardList from "../components/TutorCardList";
import { useAuth } from "../context/AuthContext";
import { fetchStudentProfile, getTutors } from "../services/api";

const BrowseTutorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    priceRange: "",
    rating: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
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
      setError(null);
      try {
        if (user?.role === "student") {
          const profile = await fetchStudentProfile();
          setStudentData(profile);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const itemsPerPage = 6;

  const fetchTutors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTutors(
        currentPage,
        itemsPerPage,
        searchQuery,
        filters
      );
      let sortedTutors = data.tutors;

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

  useEffect(() => {
    fetchTutors();
  }, [currentPage, sortOption]);

  const handleSubjectSelection = (subject) => {
    setFilters((prevFilters) => {
      const newSubjects = prevFilters.subject.includes(subject)
        ? prevFilters.subject.filter((s) => s !== subject)
        : [...prevFilters.subject, subject];
      return { ...prevFilters, subject: newSubjects };
    });
  };

  return (
    <div className="min-h-screen font-poppins bg-blue-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NavbarTwo student={studentData} />

      <div className="container mx-auto mt-12 px-6 py-10">
        <div className="mt-10 flex flex-col md:flex-row gap-10">
          {/* Sidebar Filters */}
          {/* Sidebar Filters */}
          <aside className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 w-full md:w-1/4">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Filters
            </h2>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search tutors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            {/* Price Range Slider */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Price Range: Rs. {filters.priceRange[0]} - Rs.{" "}
                {filters.priceRange[1]}
              </h4>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Rs. 0
                </span>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [0, Number(e.target.value)],
                    })
                  }
                  className="range range-xs w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Rs. 5000
                </span>
              </div>
            </div>

            {/* Rating Range Slider */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Minimum Rating: {filters.rating[0]}
              </h4>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  0
                </span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.rating[0]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      rating: [Number(e.target.value), 5],
                    })
                  }
                  className="range range-xs w-full "
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  5
                </span>
              </div>
            </div>

            {/* Multi-Select Subjects Dropdown */}
            <div className="dropdown w-full mt-8">
              <div
                tabIndex={0}
                role="button"
                className="btn w-full text-lg bg-gray-100 dark:bg-gray-700 text-gray-900 hover:text-gray-50 dark:text-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Select Subjects
              </div>
              {isDropdownOpen && (
                <ul className="dropdown-content bg-gray-100 dark:bg-gray-800 p-2 shadow-lg rounded-box w-full z-50">
                  {subjectsList.map((subject, index) => (
                    <li key={index} className="px-2 py-1">
                      <label className="cursor-pointer flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.subject.includes(subject)}
                          onChange={() => handleSubjectSelection(subject)}
                          className="checkbox "
                        />
                        <span className="text-gray-900 dark:text-white">
                          {subject}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Display Selected Subjects */}
            {filters.subject.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  Selected Subjects:
                </h4>
                <div className="flex flex-wrap gap-2 mt-3">
                  {filters.subject.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-primary  text-white text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={fetchTutors}
              className="w-full text-lg btn mt-12 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Apply Filters
            </button>
          </aside>

          {/* Main Content */}
          <main className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-semibold">Browse Tutors</h1>
              <div className="flex items-center gap-4">
                <SortDropdown setSortOption={setSortOption} />
                <button
                  onClick={() => setViewMode("grid")}
                  className={`text-xl p-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600"
                  }`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`text-xl p-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600"
                  }`}
                >
                  <FaThList />
                </button>
              </div>
            </div>

            {loading ? (
              <Skeleton height={180} className="rounded-lg" count={6} />
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <>
                {/* <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
                </div> */}
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

                {/* Static Pagination */}
                <div className="flex justify-center items-center mt-10 space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-sm bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:bg-gray-200"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`btn btn-sm rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-sm bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:bg-gray-200"
                  >
                    Next
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

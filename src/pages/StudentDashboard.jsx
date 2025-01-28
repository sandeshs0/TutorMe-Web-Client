import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
// import StudentProfile from "../components/StudentProfile";
import StudentProfileDropdown from "../components/StudentProfileDropdown";
// import ProfileDropdown from "../components/ProfileDropdown";
import { useAuth } from "../context/AuthContext";
import { fetchStudentProfile } from "../services/api";
import StudentWallet from "../components/StudentWallet";

const StudentDashboard = () => {
  const { user } = useAuth(); // Using AuthContext for user
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  ); // State for dark mode
  const [currentPage, setCurrentPage] = useState("Overview"); // State for current page
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // State for side drawer

  const drawerRef = useRef(null); // Ref for the side drawer

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Fetch student profile data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (currentPage === "Overview") {
          const profile = await fetchStudentProfile();
          setStudentData(profile);
          console.log(profile);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);
  console.log("state: ",studentData);

  // Close drawer on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        drawerOpen
      ) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [drawerOpen]);

  // Dynamic rendering based on `currentPage`
  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) {
      toast.error(error);
      return null;
    }
    switch (currentPage) {
      case "Overview":
        return <h1 className="text-2xl font-bold">Student Overview</h1>;
      case "Sessions":
        return <h1 className="text-2xl font-bold">Sessions</h1>;
      case "Statement":
        return <h1 className="text-2xl font-bold">Statement</h1>;
      case "Wallet":
        return <StudentWallet studentData={studentData}/>
      case "Profile":
      // return <StudentProfile studentData={studentData} />;
      return <h1 className="text-2xl font-bold">Profile</h1>;

      default:
        return <h1 className="text-2xl font-bold">Welcome!</h1>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen font-poppins dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-900">
      {/* Side Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full bg-gray-100 dark:bg-gray-800 z-50 transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="lg:flex items-center m-5 mb-10">
          <a
            href="/student-dashboard"
            className="bg-transparent normal-case text-xl font-bold transition-all duration-600"
          >
            <img
              src="src/assets/logostroke.png"
              alt="TutorMe Logo"
              className="h-12 mx-auto lg:mx-0"
            />
          </a>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-4 px-4">
            {[
              { name: "Overview", icon: "fas fa-home" },
              { name: "Sessions", icon: "fas fa-video" },
              { name: "Statement", icon: "fas fa-chart-line" },
              { name: "Profile", icon: "fas fa-user" },
              { name: "Wallet", icon: "fas fa-wallet" },
            ].map((item) => (
              <li key={item.name}>
                <button
                  className={`w-full flex items-center px-4 py-2 rounded-md transition ${
                    currentPage === item.name
                      ? "bg-[#0961f5] text-white font-semibold"
                      : "dark:hover:bg-gray-700 hover:bg-gray-400 hover:text-white"
                  }`}
                  onClick={() => {
                    setCurrentPage(item.name);
                    setDrawerOpen(false); // Close drawer after selection
                  }}
                >
                  <i className={`${item.icon} mr-2`}></i> {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-gray-100 dark:bg-gray-800 shadow p-4 flex justify-between items-center">
          {/* Hamburger for small screens */}
          <button
            className="lg:hidden text-xl"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle Sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-xl font-bold">
            Hi, {studentData?.name || "Student"}!
          </h1>
          <div className="flex items-center md:space-x-6 space-x-2">
            {/* Dark Mode Toggle */}
            <button
              className="btn btn-md hover:animate-pulse dark:bg-gray-700 bg-slate-200 text-2xl btn-circle btn-ghost"
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <i className="fas fa-sun text-yellow-400"></i>
              ) : (
                <i className="fas fa-moon text-blue-900"></i>
              )}
            </button>

            {/* Profile Dropdown */}
            <StudentProfileDropdown
              userName={studentData?.name || "Student"}
              userAvatar={
                studentData?.profileImage || "https://via.placeholder.com/40"
              }
            />
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-grow p-6 bg-white dark:bg-gray-900 rounded-t-lg shadow-lg overflow-y-auto">
          {renderContent()} {/* Dynamic content based on selected menu item */}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentDashboard;

import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
// import StudentProfile from "../components/StudentProfile";
import StudentProfileDropdown from "../../../components/StudentProfileDropdown";
// import ProfileDropdown from "../components/ProfileDropdown";
import useSound from "use-sound";
import lightSound from "../../../assets/sounds/light.mp3";
import StudentWallet from "../../../components/StudentWallet";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchNotifications,
  fetchStudentProfile,
  markNotificationsRead,
} from "../../../services/api";
import { socket } from "../../../utils/socket";
import StudentBookings from "./pages/BookingRequests";
import StudentProfile from "./pages/MyProfile";

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
  console.log("Student:", studentData);
  const drawerRef = useRef(null); // Ref for the side drawer
  const [playLight] = useSound(lightSound, { volume: 0.04 });
  const [notifications, setNotifications] = useState([]); // Notifications state
  const [unreadCount, setUnreadCount] = useState(0); // Unread notifications count
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification container

  useEffect(() => {
    socket.on("booking-request", (booking) => {
      // getTutorBookings().then(setBookings);
      // fetchUserNotifications();
    });
    socket.on("new-notification", (notification) => {
      // toast.info("New Notification", notification, {
      //   position: "bottom-right",
      // });
      // getTutorBookings().then(setBookings);

      fetchUserNotifications();
    });
    socket.on("booking-accepted", (booking) => {
      toast.success(`Your booking was accepted!`);
      fetchUserNotifications();
    });

    socket.on("booking-declined", (booking) => {
      toast.info(`Your booking request was declined.`);
      fetchUserNotifications();
    });
    return () => {
      // Clean up event listeners on component unmount
      socket.off("booking-request");
      socket.off("booking-accepted");
      socket.off("booking-declined");
      socket.off("new-notification");
    };
  }, [user]);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    playLight();
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Fetch student profile data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        fetchUserNotifications(); // Fetch notifications
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
  console.log("state: ", studentData);

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return "calendar-alt";
      case "message":
        return "envelope";
      case "alert":
        return "exclamation-circle";
      default:
        return "info-circle";
    }
  };

  const fetchUserNotifications = async () => {
    try {
      const notifications = await fetchNotifications();
      setNotifications(notifications);
      const unread = notifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await markNotificationsRead();
      setUnreadCount(0);
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

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
      case "Session Requests":
        return <StudentBookings />;
      case "Statement":
        return <h1 className="text-2xl font-bold">Statement</h1>;
      case "Browse Tutors":
        return window.location.replace("/browse");
      case "Wallet":
        return <StudentWallet studentData={studentData} />;
      case "Profile":
        return <StudentProfile />;
      // return <StudentProfile studentData={studentData} />;
      // return <h1 className="text-2xl font-bold">Profile</h1>;

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
              { name: "Session Requests", icon: "fas fa-file-circle-plus" },
              { name: "Browse Tutors", icon: "fas fa-globe" },
              { name: "Wallet", icon: "fas fa-wallet" },
              { name: "Statement", icon: "fas fa-chart-line" },
              { name: "Profile", icon: "fas fa-user" },
            ].map((item) => (
              <li key={item.name}>
                <button
                  className={`w-full flex items-center px-4 py-3 rounded-md transition ${
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
        <header className="bg-white border-b-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 shadow p-4 flex justify-between items-center">
          {/* Hamburger for small screens */}
          <button
            className="lg:hidden text-xl"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle Sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-2xl font-bold">
            Welcome Back, {studentData?.name || "Student"}!
          </h1>
          <div className="flex items-center md:space-x-6 space-x-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);

                  if (!showNotifications)
                    setTimeout(() => {
                      handleMarkAsRead();
                    }, 2000);
                }}
                className="relative p-2 text-xl text-gray-800 dark:text-gray-100"
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50 overflow-y-auto">
                  <h2 className="font-bold text-lg mb-2">Notifications</h2>
                  <ul className="space-y-2">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li
                          key={notification._id}
                          className={`p-3 rounded-md flex items-start space-x-3 transition-all duration-500 ease-in-out ${
                            notification.isRead
                              ? "bg-gray-100 dark:bg-gray-700"
                              : "bg-blue-100 dark:bg-blue-700 border-l-4 border-blue-600"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <i
                              className={`fas fa-${getNotificationIcon(
                                notification.type
                              )} text-xl`}
                            ></i>
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
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
              userAvatar={studentData?.profileImage}
            />
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-grow p-6 bg-white dark:bg-gray-900 shadow-lg overflow-y-auto">
          {renderContent()} {/* Dynamic content based on selected menu item */}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentDashboard;

import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import OverviewSection from "../../../components/OverViewTutorDashboard";
import SessionRequests from "../../../components/SessionRequest";
import TutorProfile from "../../../components/TutorMyProfile";
import TutorProfileDropdown from "../../../components/TutorProfileDropdown";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchNotifications,
  fetchTutorProfile,
  getTutorBookings,
  markNotificationsRead,
} from "../../../services/api";
import { socket } from "../../../utils/socket";
import SessionsCalendar from "./dashboard/CalenderSessions";
import Statement from "./dashboard/Statement";

const TutorDashboard = () => {
  const { user } = useAuth(); 
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  ); 
  const [currentPage, setCurrentPage] = useState("Overview"); 
  const [tutorData, setTutorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); 
  const [bookings, setBookings] = useState([]);
  const drawerRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
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

  // For Booking Request Notification
  useEffect(() => {
    //registering user with socket
    // if (user?.id) {
    //   registerSocket(user.id);

    socket.on("booking-request", (booking) => {
      // toast.info("New Booking Request Received", booking, {
      // position: "bottom-left",
      // });
      getTutorBookings().then(setBookings);
      // fetchUserNotifications();
    });
    socket.on("new-notification", (notification) => {
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
      socket.off("booking-request");
      socket.off("booking-accepted");
      socket.off("booking-declined");
      socket.off("new-notification");
    };
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        fetchUserNotifications();
        if (currentPage === "Overview") {
          const profile = await fetchTutorProfile();
          setTutorData(profile);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

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

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) {
      toast.error(error);
      return null;
    }
    switch (currentPage) {
      case "Overview":
        return <OverviewSection tutorData={tutorData} />;
      case "Session Requests":
        return <SessionRequests />;
      case "Statement":
        return <Statement />;
      case "Settings":
        return <h1 className="text-2xl font-bold">Settings</h1>;
      case "Calendar":
        return <SessionsCalendar tutorData={tutorData} />;
      case "Profile":
        return <TutorProfile tutorData={tutorData} />;
      default:
        return <h1 className="text-2xl font-bold">Welcome!</h1>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-blue-50 h-screen font-poppins dark:bg-gray-900 dark:text-white text-gray-900">
      {/* Side Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full bg-gray-100 dark:bg-gray-800 z-50 transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="lg:flex items-center m-5 mb-10">
          <a
            href="/tutor-dashboard"
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
              { name: "Overview", icon: "fas fa-chart-pie" },
              { name: "Session Requests", icon: "fas fa-chalkboard-teacher" },
              { name: "Calendar", icon: "fas fa-calendar-alt" },
              // { name: "Chats", icon: "fas fa-comment-dots" },
              { name: "Statement", icon: "fas fa-chart-simple" },
              { name: "Profile", icon: "fas fa-user" },
              { name: "Settings", icon: "fas fa-gear" },
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

      <div className="flex-grow flex flex-col">
        <header className="bg-gray-100 dark:bg-gray-800 shadow p-4 flex justify-between items-center">
          <button
            className="lg:hidden text-xl"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle Sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-xl font-bold">
            Hi, {tutorData?.name || "User"} !
          </h1>
          <div className="flex items-center md:space-x-6 space-x-2">
            {/* Notification */}
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
                <div className="notifications-dropdown absolute right-0 mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50 overflow-y-auto">
                  <h2
                    data-testid="notifications"
                    className="font-bold text-lg mb-2"
                  >
                    Notifications
                  </h2>
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
            <TutorProfileDropdown
              userName={tutorData?.name || "User"}
              userAvatar={
                tutorData?.profileImage || "https://via.placeholder.com/40"
              }
            />
          </div>
        </header>

        {/* Dynamic Content */}
        <main
          data-testid="main"
          className="flex-grow p-6 bg-white dark:bg-gray-900 rounded-t-lg shadow-lg overflow-y-auto"
        >
          {renderContent()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TutorDashboard;

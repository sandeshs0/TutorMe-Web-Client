import {
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Video,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  acceptBooking,
  declineBooking,
  getTutorBookings,
  startSession,
} from "../services/api";
import { socket } from "../utils/socket";
import JitsiMeetComponent from "./JitsiMeetComponent";

const SessionRequests = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth(); // Using AuthContext for user
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const [activeSession, setActiveSession] = useState(null); // Store active session


  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const allBookings = await getTutorBookings();
        const validBookings = allBookings.filter(
          (b) => b.status !== "declined"
        );
        setBookings(validBookings);
        setFilteredBookings(
          validBookings.filter((b) => b.status === filterStatus)
        );
      } catch (error) {
        toast.error("Failed to load session requests.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);


   // Handle joining session
   const handleJoinSession = async (booking) => {
    try {
      await startSession(booking._id); // Mark session as "in-progress"
      setActiveSession(booking); // Open Jitsi session
    } catch (error) {
      console.error("Error starting session:", error);
      toast.error("Failed to join session.");
    }
  };

  // Filter bookings based on status
  useEffect(() => {
    const filtered = bookings
      .filter((b) => filterStatus === "all" || b.status === filterStatus)
      .filter((b) =>
        b.studentId.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setFilteredBookings(filtered);
  }, [filterStatus, sortOrder, searchTerm, bookings]);

  // Handle booking acceptance
  const handleAccept = async (bookingId) => {
    try {
      await acceptBooking(bookingId);
      toast.success("Booking accepted!");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "accepted" } : b
        )
      );
    } catch (error) {
      toast.error("Failed to accept booking.");
      console.error(error);
    }
  };

  // Handle booking declination
  const handleDecline = async (bookingId) => {
    try {
      await declineBooking(bookingId);
      toast.info("Booking declined.");
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      toast.error("Failed to decline booking.");
      console.error(error);
    }
  };
  // const fetchUserNotifications = async () => {
  //   try {
  //     const notifications = await fetchNotifications();
  //     // setNotifications(notifications);
  //     const unread = notifications.filter((n) => !n.isRead).length;
  //     setUnreadCount(unread);
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //   }
  // };
  // Timer for accepted bookings
  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      const updatedTimers = {};

      filteredBookings.forEach((booking) => {
        if (booking.status === "accepted") {
          const sessionTime = new Date(booking.date);
          const [hours, minutes] = booking.startTime.split(":").map(Number);
          sessionTime.setHours(hours, minutes, 0);

          const diff = sessionTime - now;

          if (diff > 0) {
            if (diff > 24 * 60 * 60 * 1000) {
              updatedTimers[booking._id] = {
                text: `${Math.floor(diff / (24 * 60 * 60 * 1000))} days left`,
                sessionReady: false,
              };
            } else {
              const hoursLeft = Math.floor(diff / (60 * 60 * 1000));
              const minutesLeft = Math.floor(
                (diff % (60 * 60 * 1000)) / (60 * 1000)
              );
              const secondsLeft = Math.floor((diff % (60 * 1000)) / 1000);
              updatedTimers[booking._id] = {
                text: `Starts in: ${hoursLeft}h:${minutesLeft}m:${secondsLeft}s`,
                sessionReady: diff <= 0,
              };
            }
          } else {
            updatedTimers[booking._id] = {
              text: "Session Started",
              sessionReady: true,
            };
          }
        }
      });

      setTimers(updatedTimers);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, [filteredBookings]);

  // useEffect(() => {
  //   //registering user with socket
  //   // if (user?.id) {
  //   //   registerSocket(user.id);

  //   socket.on("booking-request", (booking) => {
  //     toast.info("New Booking Request Received", booking, {
  //       position: "bottom-left",
  //     });
  //     // getTutorBookings().then(setBookings);
  //     // fetchUserNotifications();

  //     const allBookings = getTutorBookings();
  //     const validBookings = allBookings.filter((b) => b.status !== "declined");
  //     setBookings(validBookings);
  //     setFilteredBookings(
  //       validBookings.filter((b) => b.status === filterStatus)
  //     );
  //   });
  //   socket.on("new-notification", (notification) => {
  //     // toast.info("New Notification", notification, {
  //     // position: "bottom-right",
  //     // });
  //     // getTutorBookings().then(setBookings);
  //     // fetchUserNotifications();
  //   });
  //   socket.on("booking-accepted", (booking) => {
  //     toast.success(`Your booking was accepted!`);
  //     fetchUserNotifications();
  //   });

  //   socket.on("booking-declined", (booking) => {
  //     toast.info(`Your booking request was declined.`);
  //     fetchUserNotifications();
  //   });
  //   return () => {
  //     // Clean up event listeners on component unmount
  //     socket.off("booking-request");
  //     socket.off("booking-accepted");
  //     socket.off("booking-declined");
  //     socket.off("new-notification");
  //   };
  // }, [user]);

  useEffect(() => {
    const handleNewBooking = async () => {
      try {
        const allBookings = await getTutorBookings();
        const validBookings = allBookings.filter(
          (b) => b.status !== "declined"
        );
        setBookings(validBookings);
        setFilteredBookings(
          validBookings.filter((b) => b.status === filterStatus)
        );
        // toast.info("New Booking Request Received", {
        //   position: "bottom-left",
        // });
      } catch (error) {
        console.error(
          "Error fetching bookings after new booking request:",
          error
        );
      }
    };

    socket.on("booking-request", handleNewBooking);

    return () => {
      socket.off("booking-request", handleNewBooking);
    };
  }, [filterStatus]);

  return (
    <div className="p-4 space-y-6 ">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Session Requests
      </h1>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            className="pl-12 pr-4 py-3 w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 flex-1 justify-end">
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
          </select>

          <button
            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <span>Sort by Date</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                sortOrder === "desc" ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Booking Cards */}
      <div className="grid grid-cols-1  xl:grid-cols-2 gap-5">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            className="relative dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-300 dark:border-gray-700"
          >
            {/* Status Ribbon */}
            <div
              className={`absolute -top-3 left-4 px-3 py-1.5 rounded-full text-xs font-medium ${
                booking.status === "accepted"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : booking.status === "pending"
                  ? "bg-yellow-400 text-red-800  dark:bg-yellow-400 dark:text-red-800"
                  : "bg-blue-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>

            <div className="p-6 flex gap-5">
              {/* Profile Image */}
              <div className="shrink-0 relative">
                <img
                  src={booking.studentId.profileImage}
                  alt="Student"
                  className="w-14 h-14 rounded-xl border-2 border-white dark:border-gray-800 shadow-sm object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {booking.studentId.userId.name}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Time:</span>{" "}
                      {booking.startTime}
                    </p>
                  </div>
                </div>

                {/* {booking.note && ( */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    {booking.note || "No notes provided."}
                  </p>
                {/* )} */}

                {booking.status === "accepted" && (
                  <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-md text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {timers[booking._id]?.text}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {booking.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleAccept(booking._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleDecline(booking._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Decline
                      </button>
                    </>
                  ) : booking.status === "accepted" ? (
                    <>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        Start Chat
                      </button>
                      <button
                        onClick={() => handleJoinSession(booking)}
                        disabled={!timers[booking._id]?.sessionReady}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                          timers[booking._id]?.sessionReady
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Video className="w-5 h-5" />
                        Join Session
                      </button>
                    </>
                  ) : (
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
                      <FileText className="w-5 h-5" />
                      View Summary
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activeSession && (
        <JitsiMeetComponent
          sessionRoom={activeSession.roomId}
          bookingId={activeSession._id}
          user={user}
          isTutor={user.role === "tutor"}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  );
};

export default SessionRequests;

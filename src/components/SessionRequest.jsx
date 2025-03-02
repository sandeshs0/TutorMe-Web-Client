import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Video,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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
  const { user } = useAuth(); 
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const [activeSession, setActiveSession] = useState(null); 

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

  const handleJoinSession = async (booking) => {
    try {
      console.log("🔹 Fetching session room for booking:", booking._id);

      const response = await startSession(booking._id);

      if (response.success && response.session.roomId) {
        console.log(" Session room URL received:", response.session.roomId);

        setActiveSession({ ...booking, roomId: response.session.roomId });
      } else {
        toast.error("Failed to retrieve session room.");
        console.error(
          "Error: Session room not found in API response",
          response
        );
      }
    } catch (error) {
      console.error(" Error starting session:", error);
      toast.error("Error starting session.");
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

  // Count for each status
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const acceptedCount = bookings.filter((b) => b.status === "accepted").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  return (
    <div
      data-testid="session-requests-container"
      className="p-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Session Requests
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your teaching sessions and student requests
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span className="font-medium">
                Today: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
              filterStatus === "all"
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            All Requests
            <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
              filterStatus === "pending"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Pending
            <span className="ml-2 px-2 py-0.5 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("accepted")}
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
              filterStatus === "accepted"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Accepted
            <span className="ml-2 px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
              {acceptedCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
              filterStatus === "completed"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Completed
            <span className="ml-2 px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {completedCount}
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-12 pr-4 py-3 w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>

          <button
            className="px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="w-5 h-5 text-gray-500" />
            <span>{sortOrder === "asc" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>

        {filteredBookings.length === 0 && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-4">
              <CalendarDays className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No {filterStatus === "all" ? "" : filterStatus} requests found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {filterStatus === "pending"
                ? "You have no pending session requests at the moment."
                : filterStatus === "accepted"
                ? "You haven't accepted any session requests yet."
                : filterStatus === "completed"
                ? "You don't have any completed sessions to display."
                : "There are no session requests matching your filters."}
            </p>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                View All Requests
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div
                  className={`h-2 w-full ${
                    booking.status === "accepted"
                      ? "bg-green-500"
                      : booking.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                ></div>

                <div className="p-6">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0">
                      <img
                        src={booking.studentId.profileImage}
                        alt={booking.studentId.userId.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start mb-2">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {booking.studentId.userId.name}
                          </h2>
                          <div className="inline-flex items-center px-2 py-1 mt-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                            <CalendarDays className="w-4 h-4" />
                            <span>
                              {new Date(booking.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{booking.startTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {booking.note || "No notes provided."}
                        </p>
                      </div>

                      {booking.status === "accepted" && (
                        <div className="mb-4">
                          <div
                            className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                              timers[booking._id]?.sessionReady
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">
                              {timers[booking._id]?.text}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 mt-4">
                        {booking.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleAccept(booking._id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecline(booking._id)}
                              className="flex-1 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                              <XCircle className="w-5 h-5" />
                              Decline
                            </button>
                          </>
                        ) : booking.status === "accepted" ? (
                          <>
                            <button className="flex-1 border border-indigo-200 dark:border-indigo-800 bg-white hover:bg-indigo-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-indigo-600 dark:text-indigo-400 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                              <MessageSquare className="w-5 h-5" />
                              Message
                            </button>
                            <button
                              onClick={() => handleJoinSession(booking)}
                              disabled={!timers[booking._id]?.sessionReady}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
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
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <FileText className="w-5 h-5" />
                            View Session Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeSession && (
        <JitsiMeetComponent
          sessionRoom={activeSession.roomId}
          bookingId={activeSession._id}
          user={user}
          isTutor={true}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  );
};

export default SessionRequests;

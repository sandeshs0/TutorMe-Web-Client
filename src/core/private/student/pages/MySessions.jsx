import {
  ArrowUpDown,
  Calendar,
  CalendarDays,
  Clock,
  Info,
  Search,
  User,
  Video,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
import { toast } from "sonner";
import JitsiMeetComponent from "../../../../components/JitsiMeetComponent";
import { useAuth } from "../../../../context/AuthContext";
import { fetchStudentSessions } from "../../../../services/api";
const StudentSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const { user } = useAuth();

  // Fetch sessions on component mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const sessionsData = await fetchStudentSessions();
        setSessions(sessionsData);
        setFilteredSessions(sessionsData);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        toast.error("Failed to fetch sessions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Filter and sort sessions when criteria change
  useEffect(() => {
    let filtered = [...sessions];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((session) => session.status === filterStatus);
    }

    // Apply search filter on tutor name
    if (searchTerm) {
      filtered = filtered.filter((session) =>
        session.tutorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredSessions(filtered);
  }, [sessions, filterStatus, searchTerm, sortOrder]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time to a more readable format
  const formatTime = (timeString) => {
    if (!timeString) return "Not set";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Join session
  const handleJoinSession = (session) => {
    setActiveSession(session);
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in-progress":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Count sessions by status
  const scheduledCount = sessions.filter(
    (s) => s.status === "scheduled"
  ).length;
  const inProgressCount = sessions.filter(
    (s) => s.status === "in-progress"
  ).length;
  const completedCount = sessions.filter(
    (s) => s.status === "completed"
  ).length;

  // Check if session can be joined
  const canJoinSession = (session) => {
    return session.status === "scheduled" || session.status === "in-progress";
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              My Sessions
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              View and manage your scheduled learning sessions
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

        {/* Filter Pills */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
              filterStatus === "all"
                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            All Sessions
            <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              {sessions.length}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("scheduled")}
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
              filterStatus === "scheduled"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Scheduled
            <span className="ml-2 px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {scheduledCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("in-progress")}
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
              filterStatus === "in-progress"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            In Progress
            <span className="ml-2 px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
              {inProgressCount}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all ${
              filterStatus === "completed"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Completed
            <span className="ml-2 px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full">
              {completedCount}
            </span>
          </button>
        </div>

        {/* Filters & Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tutor name..."
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
            <span>
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </span>
          </button>
        </div>

        {/* Loading State */}
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

        {/* No Results State */}
        {!loading && filteredSessions.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No {filterStatus === "all" ? "" : filterStatus} sessions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {filterStatus === "all"
                ? "You don't have any tutoring sessions yet."
                : `You don't have any ${filterStatus} sessions at the moment.`}
            </p>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                View All Sessions
              </button>
            )}
          </div>
        )}

        {/* Sessions List */}
        {!loading && filteredSessions.length > 0 && (
          <div className="space-y-6">
            {filteredSessions.map((session) => (
              <div
                key={session.sessionId}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Status Bar */}
                <div
                  className={`h-2 w-full ${
                    session.status === "scheduled"
                      ? "bg-blue-500"
                      : session.status === "in-progress"
                      ? "bg-green-500"
                      : session.status === "completed"
                      ? "bg-purple-500"
                      : "bg-red-500"
                  }`}
                ></div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    {/* Session Info */}
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                          Session with {session.tutorName}
                        </h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <span className="inline-flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(session.date)}
                          </span>
                          <span className="inline-flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(session.startTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeStyle(
                          session.status
                        )}`}
                      >
                        {session.status}
                      </span>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-0">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Tutor Email
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {session.tutorEmail}
                        </p>
                      </div>

                      {session.duration > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Duration
                          </p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {session.actualDuration} min
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div>
                      {canJoinSession(session) ? (
                        <button
                          onClick={() => handleJoinSession(session)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <Video className="w-5 h-5" />
                          Join Session
                        </button>
                      ) : (
                        <button
                          className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed"
                          disabled
                        >
                          <Info className="w-5 h-5" />
                          {session.status === "completed"
                            ? "Session Completed"
                            : "Session Unavailable"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Session Modal */}
      {activeSession && (
        <JitsiMeetComponent
          sessionRoom={activeSession.roomId}
          bookingId={activeSession.bookingId}
          user={user}
          isTutor={false}
          onClose={() => setActiveSession(null)}
        />
      )}
    </div>
  );
};

export default StudentSessions;

import {
  AlertCircle,
  Book,
  Calendar as CalendarIcon,
  Check,
  Clock,
  User,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchTutorSessions } from "../../../../services/api"; // Adjust the path as needed

// Initialize moment localizer with proper moment configuration
const localizer = momentLocalizer(moment);

const SessionsCalendar = ({ tutorData }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("month");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetchTutorSessions();

        // Check if response exists and has a sessions array
        if (!response || typeof response !== "object") {
          throw new Error("Invalid API response format");
        }

        // Handle the response structure, ensuring sessions is an array
        let sessionsData = [];
        if (response.success === true && Array.isArray(response.sessions)) {
          sessionsData = response.sessions;
        } else if (Array.isArray(response)) {
          // Fallback if the response is directly an array of sessions
          sessionsData = response;
        } else {
          throw new Error("Invalid session data format from API");
        }

        setSessions(formatSessions(sessionsData));
      } catch (error) {
        setError(error.message || "Error fetching sessions data");
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Format sessions for react-big-calendar, handling null endTime and date/time parsing
  const formatSessions = (sessionsData) => {
    if (!sessionsData || !Array.isArray(sessionsData)) {
      console.warn("Sessions data is invalid or undefined:", sessionsData);
      return [];
    }

    return sessionsData
      .map((session) => {
        // Check if session exists and has required fields
        if (!session || typeof session !== "object") {
          console.warn("Invalid session object:", session);
          return null; // Skip invalid sessions, they'll be filtered out by .filter below
        }

        // Parse startTime (string in "Sun Mar 02 2025 03:46:09 GMT+0545 (Nepal Time)" format)
        const start = moment(
          session.startTime,
          "ddd MMM DD YYYY HH:mm:ss GMT+XXXX (ZZ)"
        ).toDate();

        // Handle null endTime by setting it to one hour after startTime
        let end = moment(start).add(1, "hour").toDate(); // Default to 1 hour after startTime

        // If endTime exists, use it; otherwise, use duration or default
        if (session.endTime) {
          end = moment(
            session.endTime,
            "ddd MMM DD YYYY HH:mm:ss GMT+XXXX (ZZ)"
          ).toDate();
        } else if (session.duration && session.duration > 0) {
          end = moment(start)
            .add(session.duration * 60, "minutes")
            .toDate(); // Convert duration (hours) to minutes
        }

        // Filter out any null or invalid sessions after mapping
        return {
          id: session.sessionId || "unknown-id",
          title: `${session.studentName || "Unknown Student"} - ${
            session.subject || "N/A"
          }`,
          start,
          end,
          status: session.status || "unknown", // Default to 'unknown' if status is missing
          duration: session.duration || 1, // Default to 1 hour if duration is 0 or undefined
          studentId: session.studentId || "unknown-student",
          subject: session.subject || "N/A",
          studentName: session.studentName || "Unknown Student",
        };
      })
      .filter((session) => session !== null); // Remove any null entries from invalid sessions
  };

  // Custom event style for color-coding
  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = "#059669"; // Emerald-600 for upcoming
    let opacity = 0.9;
    let borderLeft = "4px solid #047857"; // Emerald-700

    const now = new Date();
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    if (eventStart <= now && eventEnd >= now) {
      // In progress
      backgroundColor = "#4338CA"; // Indigo-700
      borderLeft = "4px solid #3730A3"; // Indigo-800
    } else if (event.status === "completed") {
      // Completed
      backgroundColor = "#0284C7"; // Sky-600
      borderLeft = "4px solid #0369A1"; // Sky-700
    } else if (eventStart < now && event.status !== "completed") {
      // Missed or past sessions (not completed)
      backgroundColor = "#DC2626"; // Red-600
      borderLeft = "4px solid #B91C1C"; // Red-700
    }

    if (isSelected) {
      opacity = 1;
      backgroundColor =
        event.status === "completed"
          ? "#0369A1" // Sky-700 for completed
          : eventStart < now
          ? "#B91C1C"
          : "#047857"; // Red-700 or Emerald-700
    }

    return {
      style: {
        backgroundColor,
        borderLeft,
        opacity,
        color: "white",
        display: "block",
        padding: "4px 6px",
        borderRadius: "4px",
        fontWeight: isSelected ? "600" : "500",
        boxShadow: isSelected
          ? "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
          : "none",
        transition: "all 0.2s ease",
      },
    };
  };

  // Custom event component for richer display
  const EventComponent = ({ event }) => {
    // Choose icon based on event status
    let StatusIcon = Check;
    if (event.status === "in-progress") {
      StatusIcon = Clock;
    } else if (event.status === "upcoming") {
      StatusIcon = Calendar;
    } else if (event.status !== "completed") {
      StatusIcon = AlertCircle;
    }

    return (
      <div className="flex items-center space-x-1 py-1">
        <div className="flex-shrink-0">
          <StatusIcon className="h-3 w-3 text-white" />
        </div>
        <div className="truncate text-xs">
          <span className="font-semibold">{event.studentName}</span>
          {view !== "agenda" ? (
            <span> • {event.subject}</span>
          ) : (
            <div className="flex items-center mt-1 space-x-2">
              <Book className="h-3 w-3" />
              <span>{event.subject}</span>
              <Clock className="h-3 w-3 ml-1" />
              <span>
                {moment(event.start).format("h:mm A")} -{" "}
                {moment(event.end).format("h:mm A")}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Custom toolbar for better controls
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
    };

    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 py-2 mb-4">
        <div className="flex items-center mb-3 sm:mb-0">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={goToBack}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="ml-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={goToNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button
            className="ml-3 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
            onClick={goToCurrent}
          >
            Today
          </button>
          <span className="text-lg font-semibold ml-4 text-gray-800 dark:text-gray-200">
            {toolbar.label}
          </span>
        </div>
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {["month", "week", "day", "agenda"].map((option) => (
            <button
              key={option}
              className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                toolbar.view === option
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                toolbar.onView(option);
                setView(option);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Custom loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex space-x-1">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            <div className="h-96 p-4 grid grid-cols-7 gap-1 animate-pulse">
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-750 rounded p-1"
                >
                  <div className="h-3 w-3 mb-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  {Math.random() > 0.7 && (
                    <div className="h-8 mt-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Custom error state
  if (error) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 dark:text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Unable to Load Calendar
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calendar legend component
  const CalendarLegend = () => (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-sm bg-emerald-600 mr-1.5"></div>
        <span className="text-gray-700 dark:text-gray-300">Upcoming</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-sm bg-indigo-700 mr-1.5"></div>
        <span className="text-gray-700 dark:text-gray-300">In Progress</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-sm bg-sky-600 mr-1.5"></div>
        <span className="text-gray-700 dark:text-gray-300">Completed</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-sm bg-red-600 mr-1.5"></div>
        <span className="text-gray-700 dark:text-gray-300">Missed</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              Sessions Calendar
              {tutorData.name && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  {tutorData.name}
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center">
              <User className="w-4 h-4 mr-1.5" />
              {sessions.length} {sessions.length === 1 ? "session" : "sessions"}{" "}
              scheduled
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800/50">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span className="font-medium">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CalendarLegend />
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>
          </div>

          <div className="p-4">
            <Calendar
              localizer={localizer}
              events={sessions}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 650 }}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent,
                toolbar: CustomToolbar,
              }}
              views={["month", "week", "day", "agenda"]}
              defaultView="month"
              tooltipAccessor={(event) =>
                `${event.studentName} • ${event.subject}\nDuration: ${event.duration} hours\nStatus: ${event.status}`
              }
              className="react-big-calendar-modern dark:text-gray-100"
              onView={(newView) => setView(newView)}
            />
          </div>
        </div>
      </div>

      {/* Add a style tag to customize the calendar for dark mode */}
      <style jsx>{`
        :global(.react-big-calendar-modern.rbc-calendar) {
          font-family: ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", Roboto;
        }

        :global(.dark .react-big-calendar-modern .rbc-month-view) {
          border-color: #374151;
        }

        :global(.dark .react-big-calendar-modern .rbc-header) {
          color: #d1d5db;
          border-bottom-color: #374151;
        }

        :global(.dark .react-big-calendar-modern .rbc-off-range-bg) {
          background: #1f2937;
        }

        :global(.dark .react-big-calendar-modern .rbc-off-range) {
          color: #6b7280;
        }

        :global(.dark .react-big-calendar-modern .rbc-today) {
          background: #1e40af20;
        }

        :global(.dark .react-big-calendar-modern .rbc-day-bg) {
          border-color: #374151;
        }

        :global(.dark .react-big-calendar-modern .rbc-month-row) {
          border-color: #374151;
        }

        :global(.dark .react-big-calendar-modern .rbc-date-cell) {
          color: #d1d5db;
          padding: 4px 8px;
        }

        :global(.dark .react-big-calendar-modern .rbc-time-header-content),
        :global(.dark .react-big-calendar-modern .rbc-time-view),
        :global(
            .dark .react-big-calendar-modern .rbc-time-view .rbc-time-gutter
          ),
        :global(
            .dark .react-big-calendar-modern .rbc-time-header.rbc-overflowing
          ),
        :global(.dark .react-big-calendar-modern .rbc-month-view),
        :global(
            .dark
              .react-big-calendar-modern
              .rbc-agenda-view
              table.rbc-agenda-table
          ),
        :global(
            .dark
              .react-big-calendar-modern
              .rbc-agenda-view
              table.rbc-agenda-table
              tbody
              > tr
              > td
          ),
        :global(
            .dark
              .react-big-calendar-modern
              .rbc-agenda-view
              table.rbc-agenda-table
              thead
              > tr
              > th
          ) {
          border-color: #374151;
        }

        :global(.dark .react-big-calendar-modern .rbc-agenda-table) {
          color: #d1d5db;
        }

        :global(.dark .react-big-calendar-modern .rbc-time-content > * + * > *),
        :global(
            .dark
              .react-big-calendar-modern
              .rbc-time-view
              .rbc-day-slot
              .rbc-time-slot
          ) {
          border-color: #2d3748;
        }
      `}</style>
    </div>
  );
};

export default SessionsCalendar;

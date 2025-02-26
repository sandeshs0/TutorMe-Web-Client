import React, { useEffect, useState } from "react";
import { FaRegClock, FaRegStar, FaCalendarCheck } from "react-icons/fa";
import { MdOutlineDateRange, MdOutlineAccessTime, MdNotes } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { toast } from "react-toastify";
import { getStudentBookings } from "../../../../services/api";

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getStudentBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || "Failed to fetch bookings");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    if (activeFilter === "all") return bookings;
    return bookings.filter(booking => booking.status === activeFilter);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
            My Bookings
          </h1>
          
          {/* Filter tabs */}
          <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === "all" 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter("pending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === "pending" 
                  ? "bg-yellow-500 text-white" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveFilter("accepted")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === "accepted" 
                  ? "bg-green-500 text-white" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Accepted
            </button>
            <button 
              onClick={() => setActiveFilter("declined")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === "declined" 
                  ? "bg-red-500 text-white" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Declined
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <SkeletonCard key={item} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
            <div className="flex justify-center mb-4">
              <FaCalendarCheck className="text-6xl text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Bookings Found</h3>
            <p className="text-gray-500 dark:text-gray-400">You haven't made any bookings yet.</p>
          </div>
        ) : getFilteredBookings().length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
            <div className="flex justify-center mb-4">
              <FaCalendarCheck className="text-6xl text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No {activeFilter} Bookings</h3>
            <p className="text-gray-500 dark:text-gray-400">
              You don't have any bookings with {activeFilter} status.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredBookings().map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className={`h-2 ${getStatusColorClass(booking.status)}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Tutor Profile Image */}
                    <div className="relative">
                      <img
                        src={booking.profileImage || "/api/placeholder/80/80"}
                        alt={booking.tutorName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.tutorName)}&background=random`;
                        }}
                      />
                      <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusDotClass(booking.status)}`}></span>
                    </div>

                    <div>
                      {/* Tutor Name */}
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {booking.tutorName}
                      </h2>
                      {/* Status Badge */}
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-b border-gray-200 dark:border-gray-700"></div>

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <MdOutlineDateRange className="text-lg text-blue-500 mr-3 flex-shrink-0" />
                      <span className="font-medium">{formatDate(booking.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <MdOutlineAccessTime className="text-lg text-green-500 mr-3 flex-shrink-0" />
                      <span className="font-medium">{booking.startTime}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <BsCurrencyDollar className="text-lg text-purple-500 mr-3 flex-shrink-0" />
                      <span className="font-medium">Rs. {booking.hourlyRate} per hour</span>
                    </div>
                    
                    {booking.note && (
                      <div className="flex text-gray-700 dark:text-gray-300 mt-3">
                        <MdNotes className="text-lg text-amber-500 mr-3 flex-shrink-0 mt-1" />
                        <p className="italic text-sm text-gray-600 dark:text-gray-400">"{booking.note}"</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action button based on status */}
                  <div className="mt-6">
                    {booking.status === "accepted" && (
                      <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        <FaRegStar className="text-yellow-300" /> Rate This Session
                      </button>
                    )}
                    {booking.status === "pending" && (
                      <button className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for bookings
const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-2 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-6">
        <div className="flex items-center gap-4">
          {/* Skeleton Profile Image */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-gray-200 dark:bg-gray-600"></div>
          </div>

          <div className="space-y-2">
            {/* Skeleton Tutor Name */}
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            {/* Skeleton Status Badge */}
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-b border-gray-200 dark:border-gray-700"></div>

        {/* Skeleton Booking Details */}
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div className="flex">
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 mt-1"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        
        {/* Skeleton Action Button */}
        <div className="mt-6">
          <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

// Function to format the date nicely
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Functions for status styling
const getStatusColorClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "accepted":
      return "bg-green-500";
    case "declined":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusDotClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "accepted":
      return "bg-green-500";
    case "declined":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "declined":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default StudentBookings;
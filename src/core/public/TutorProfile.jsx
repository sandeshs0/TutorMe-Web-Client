import { CircleChevronLeft, SquareArrowOutUpRight, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";
import NavbarTwo from "../../components/NavbarTwo";
import { useAuth } from "../../context/AuthContext";
import {
  fetchStudentProfile,
  fetchTutor,
  requestBooking,
} from "../../services/api";

const TutorProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // New state for login prompt
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Confirmation modal state

  // Mock reviews data - in production, this would come from an API
  const reviews = [
    {
      id: 1,
      student: "Sarah M.",
      rating: 5,
      date: "2024-02-01",
      content: "Excellent tutor! Really helped me understand complex concepts.",
      helpful: 12,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 2,
      student: "James K.",
      rating: 4,
      date: "2024-01-28",
      content: "Very patient and knowledgeable. Would recommend!",
      helpful: 8,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 3,
      student: "Emma R.",
      rating: 5,
      date: "2024-01-15",
      content: "Great at explaining difficult topics in simple terms.",
      helpful: 15,
      avatar: "/api/placeholder/32/32",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tutorData, studentProfileData] = await Promise.all([
          fetchTutor(username),
          user?.role === "student" ? fetchStudentProfile() : null,
        ]);
        setTutor(tutorData.tutor);
        if (studentProfileData) {
          setStudentData(studentProfileData);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch tutor details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, user]);

  const handleBookingClick = () => {
    if (!user) {
      setShowLoginPrompt(true); // Show login modal if user is not logged in
    } else {
      setIsModalOpen(true); // Open booking modal if user is logged in
    }
  };

  const handleBooking = async () => {
    if (!date || !time) {
      toast.warning("Please select a date and time.", {
        position: "bottom-right",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestBooking(tutor.id, date, time, notes);
      toast.success("Booking request sent successfully!", {
        position: "bottom-right",
      });
      console.log("Booking Response:", response);
      if (user?.role === "student") {
        const updatedStudentData = await fetchStudentProfile();
        setStudentData(updatedStudentData);
      }
      setIsModalOpen(false); // Close modal on success
      setShowConfirmationModal(true); // Show confirmation modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed.", {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Stars = ({ rating }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-gray-400"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <NavbarTwo student={studentData} />
      <div className="mt-20 container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <CircleChevronLeft className="w-6 h-6" />
          <span>Back to Browse</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
              {/* Left Section: Profile Image and Basic Info */}
              <div className="flex items-start gap-8 flex-1">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-56 h-56 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={tutor?.profileImage || "/api/placeholder/160/160"}
                      alt={tutor?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-sm
                  ${
                    tutor?.isOnline
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                  >
                    {tutor?.isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                {/* Profile Info */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                      {tutor?.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                      {tutor?.bio || "No Bio needed"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Stars rating={tutor?.rating || 0} />
                    <span className="text-gray-600 dark:text-gray-400">
                      ({tutor?.rating?.toFixed(1) || "0.0"})
                    </span>
                  </div>

                  <div className="text-gray-600 dark:text-gray-400">
                    {tutor?.lessonsTaught || "100+"} Lessons Completed
                  </div>

                  <div>
                    <h3 className="text-gray-900 dark:text-white font-medium mb-3">
                      Teaching Expertise:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(
                        tutor?.subjects || [
                          "MERN",
                          "Digital Marketing",
                          "ChatGPT",
                        ]
                      ).map((subject, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded-lg text-sm"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: Pricing and Booking */}
              <div className="lg:w-72  mt-24 w-full flex flex-col items-center lg:items-end gap-4">
                <div className="text-right">
                  <h2 className="text-xl text-gray-600 dark:text-gray-400">
                    Hourly Rate
                  </h2>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    Rs {tutor?.hourlyRate}
                    <span className="text-lg font-normal">/hr</span>
                  </p>
                </div>
                <button
                  onClick={handleBookingClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-6 rounded-xl transition-colors text-lg font-medium"
                >
                  Request a Session
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Modal for Booking */}

        {/* 🔥 Modal for Booking with Tailwind dark: Classes */}
        <input
          type="checkbox"
          id="booking-modal"
          className="modal-toggle"
          checked={isModalOpen}
          readOnly
        />
        <div className="modal">
          <div className="modal-box relative bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            <label
              htmlFor="booking-modal"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm border-none absolute right-2 top-2 bg-red-200 text-red-800 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              ✕
            </label>
            <h2 className="text-2xl font-bold mb-4">Send a Session Request</h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-800 dark:text-gray-300">
                  Date
                </span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input input-bordered w-full bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-gray-800 dark:text-gray-300">
                  Time
                </span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input input-bordered w-full bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-gray-800 dark:text-gray-300">
                  Notes
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="textarea textarea-bordered w-full bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              <strong>Note:</strong> Rs. 30 will be deducted as booking fee from
              your balance. If the booking request is declined/cancelled, the
              amount will be refunded.
            </p>

            <div className="modal-action">
              <button
                onClick={handleBooking}
                className={`btn bg-blue-800 text-white w-full ${
                  isSubmitting ? "loading" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
        {/* 🔥 Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-[400px] relative">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Please Sign In First
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You need to be signed in to request a session.
              </p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex px-4 py-2 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Go to Login <SquareArrowOutUpRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 Confirmation Modal */}
        {showConfirmationModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[700px] m-4">
              {/* Top Section */}
              <div className="flex items-center justify-center py-6 border-b border-gray-200 dark:border-gray-700">
                <img
                  src="https://i.postimg.cc/cJHjgTKP/tickk.png" // Replace with the tick image path
                  alt="Confirmation Tick"
                  className="w-20 h-20"
                />
              </div>

              {/* Main Content */}
              <div className="px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Session Requested!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  You have requested a session from{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {tutor?.name}
                  </span>
                  . You’ll be notified once it is accepted by the tutor.
                </p>
                <ul className="text-gray-600 dark:text-gray-400">
                  <li>
                    <strong>Tutor:</strong> {tutor?.name}
                  </li>
                  <li>
                    <strong>When:</strong> {date} at {time}
                  </li>
                  <li>
                    <strong>Hourly Rate:</strong> Rs. {tutor?.hourlyRate}
                  </li>
                  <li>
                    <strong>Booking Fee:</strong> Rs. 30 (refundable)
                  </li>
                </ul>
              </div>

              {/* Buttons Section */}
              <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  Okay!
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {tutor?.description ||
                "A passionate educator with expertise in modern web technologies and digital marketing. Specialized in MERN stack development and AI applications."}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Student Reviews
            </h2>
            <div className="space-y-6">
              {reviews?.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={review.avatar}
                        alt={review.student}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {review.student}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <Stars rating={review.rating} />
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TutorProfilePage;

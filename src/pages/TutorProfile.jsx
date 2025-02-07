import { CircleChevronLeft, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NavbarTwo from "../components/NavbarTwo";
import { useAuth } from "../context/AuthContext";
import { fetchStudentProfile, fetchTutor, createBooking } from "../services/api";

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

  const handleBooking = async () => {
    if (!date || !time) {
      toast.warning("Please select a date and time.");
      return;
    }

    setIsSubmitting(true);
    try {
      // const response = await createBooking(tutor.id, date, time, notes);
      toast.success("Booking request sent successfully!");
      // console.log("Booking Response:", response);
      setIsModalOpen(false); // Close modal on success
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed.");
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
      <ToastContainer />
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
                    ₹1500<span className="text-lg font-normal">/hr</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-6 rounded-xl transition-colors text-lg font-medium"
                >
                  Book a Session
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* 🔥 Modal for Booking */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-[400px] relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Book a Session
              </h2>
              <label className="block mb-2 text-gray-600 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-blue-500"
              />

              <label className="block mt-4 mb-2 text-gray-600 dark:text-gray-300">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-blue-500"
              />

              <label className="block mt-4 mb-2 text-gray-600 dark:text-gray-300">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-blue-500"
              />

              <button
                onClick={handleBooking}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </button>
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
    </div>
  );
};

export default TutorProfilePage;

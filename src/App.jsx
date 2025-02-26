import "@theme-toggles/react/css/Horizon.css";
import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import PaymentCallback from "./components/PaymentCallback";
import { useAuth } from "./context/AuthContext";
import BrowseTutorsPage from "./pages/BrowseTutors";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
// import TutorDashboard from "./pages/TutorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TutorDashboard from "./core/private/tutor/layout";
import TutorProfilePage from "./pages/TutorProfile";
import { registerSocket } from "./utils/socket";

const App = () => {
  const { user } = useAuth(); // Get logged-in user

  useEffect(() => {
    if (user) {
      registerSocket(user.id); // ✅ Register user with WebSockets
    }

    // Handle real-time booking events
    // if (socket) {
    //   socket.on("booking-request", (booking) => {
    //     console.log("New Booking Request Received:", booking);
    //     alert(`New booking request from student ID: ${booking.studentId}`);
    //   });

    //   socket.on("booking-accepted", (booking) => {
    //     console.log("Booking Accepted:", booking);
    //     alert("Your booking was accepted!");
    //   });

    //   socket.on("booking-declined", (booking) => {
    //     console.log("Booking Declined:", booking);
    //     alert("Your booking was declined.");
    //   });

    //   return () => {
    //     socket.off("booking-request");
    //     socket.off("booking-accepted");
    //     socket.off("booking-declined");
    //   };
    // }
  }, [user]);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/browse" element={<BrowseTutorsPage />} />
          <Route path="/tutors/:username" element={<TutorProfilePage />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />

          {/* //   Protected Routes for Student 
          <Route element={<ProtectedRoute requiredRole="student" />}>
            <Route path="/account-center" element={<StudentDashboard />} />
          </Route>

          // Protected Routes for Tutor 
          <Route element={<ProtectedRoute requiredRole="tutor" />}>
            <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          </Route> */}

          <Route
            path="/account-center"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes for Tutors */}
          <Route
            path="/tutor-dashboard"
            element={
              <ProtectedRoute requiredRole="tutor">
                <TutorDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default App;

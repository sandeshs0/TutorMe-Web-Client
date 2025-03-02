import "@theme-toggles/react/css/Horizon.css";
import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import PaymentCallback from "./components/PaymentCallback";
import { useAuth } from "./context/AuthContext";
import StudentDashboard from "./core/private/student/StudentDashboard";
import BrowseTutorsPage from "./core/public/BrowseTutors";
import HomePage from "./core/public/HomePage";
import LoginPage from "./core/public/LoginPage";
import OtpPage from "./core/public/OtpPage";
import SignupPage from "./core/public/SignupPage";
// import TutorDashboard from "./pages/TutorDashboard";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import TutorDashboard from "./core/private/tutor/layout";
import TutorProfilePage from "./core/public/TutorProfile";
import { registerSocket } from "./utils/socket";

const App = () => {
  const { user } = useAuth(); // Get logged-in user

  useEffect(() => {
    if (user) {
      registerSocket(user.id);
    }
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

          <Route
            path="/account-center"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

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
        <Toaster position="top-center" richColors />
      </div>
    </>
  );
};

export default App;

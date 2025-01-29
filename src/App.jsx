import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "@theme-toggles/react/css/Horizon.css"

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import SignupPage from './pages/SignupPage';
import { ToastContainer } from "react-toastify";
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PaymentCallback from './components/PaymentCallback';


const App = () => {
  return (
    <><Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
        <Route path="/account-center" element={<StudentDashboard />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        

      </Routes>
    </Router>
    <div>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Your Routes and Components */}
      </div></>
  );
};

export default App;

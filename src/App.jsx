import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OtpPage from './pages/OtpPage';
import SignupPage from './pages/SignupPage';
import { ToastContainer } from "react-toastify";


const App = () => {
  return (
    <><Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />

      </Routes>
    </Router>
    <div>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Your Routes and Components */}
      </div></>
  );
};

export default App;

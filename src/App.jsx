import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OtpPage from './pages/OtpPage';


const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />

    </Routes>
  </Router>
  );
};

export default App;

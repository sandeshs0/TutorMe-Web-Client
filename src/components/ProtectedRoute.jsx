import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ requiredRole, children }) => {
  const { isLoggedIn, isTutor, isStudent, loading } = useAuth();

  console.log("ProtectedRoute Mounted");
  console.log("ProtectedRoute Debug:", {
    isLoggedIn: isLoggedIn(),
    requiredRole,
    loading,
  });

  if (loading) {
    console.log("⏳ Authentication data is loading...");
    return null; // Prevent redirecting before auth state is ready
  }
  if (!isLoggedIn()) {
    console.warn("🔴 User is not logged in, redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (requiredRole === "tutor" && !isTutor()) {
    console.warn("🔴 Access denied! Tutor role required.");
    return <Navigate to="/" />;
  }

  if (requiredRole === "student" && !isStudent()) {
    console.warn("🔴 Access denied! Student role required.");
    return <Navigate to="/" />;
  }

  console.log("✅ User authorized, rendering protected page.");
  return children; // ✅ Render the child component directly
};

export default ProtectedRoute;

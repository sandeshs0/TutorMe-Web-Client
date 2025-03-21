import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import { useAuth } from "../../context/AuthContext"; 
import { loginUser } from "../../services/api";
import { registerSocket } from "../../utils/socket";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false); 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const { user, token } = await loginUser(formData); 
      login({ userData: user, authToken: token });
      if (user.role === "student") {
        navigate("/");
        toast.success("Login successful", { position: "bottom-right" });
      } else if (user.role === "tutor") {
        navigate("/tutor-dashboard");
        toast.success("Login successful as Tutor", {
          position: "bottom-right",
        });
        toast.info("Redirecting to dashboard...", { position: "bottom-right" });
      }
      console.log(user);
      console.log("🔹 Registering socket for user:", user._id);
      registerSocket(user._id);
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach(({ path, message }) => {
          validationErrors[path] = message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.message || "Login failed. Please try again.");
        setErrors({
          general: err.message || "Login failed. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>

      <div className="relative flex items-center justify-center min-h-screen bg-[#F8FAFC] px-4">
        <div className="relative bg-white shadow-md rounded-2xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2">
          <button
            className="absolute font-poppins opacity-100 hover:opacity-100 top-3 right-3 font-thin text-red-300 hover:text-red-500 text-3xl hover:bg-red-100 px-3 rounded-md py-2 bg-transparent focus:outline-none z-50"
            onClick={() => navigate("/")}
          >
            <i class="fas fa-xmark"></i>
          </button>

          <div className="p-8 lg:p-12">
            <h1 className="text-3xl font-bold font-poppins  text-gray-800">
              WELCOME BACK
            </h1>
            <p className="text-gray-500 mt-2 font-poppins">
              Welcome back! Please enter your details.
            </p>

            <form
              className="mt-6 space-y-6 font-poppins"
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-md text-gray-800 font-semibold"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full mt-1 p-3 border text-black rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-md text-gray-800 font-semibold"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="********"
                  className="w-full mt-1 p-3 text-black border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute top-9 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash"></i> 
                  ) : (
                    <i className="fas fa-eye"></i> 
                  )}
                </button>
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-sm">
                    {errors.password}
                  </p>
                )}
              </div>
              {errors.general && (
                <p id="general-error" className="text-red-500 text-sm">{errors.general}</p>
              )}
              <div className="flex items-center justify-between text-sm lg:text-md font-poppins">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2 rounded border-gray-300"
                  />
                  <label htmlFor="remember" className="text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-blue-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                id="login-button"
                className="btn w-full bg-blue-500 text-white py-3 text-xl font-poppins rounded-lg shadow-md hover:bg-blue-600 focus:outline-none "
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center font-poppins text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-500 font-medium hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center bg-transparent rounded-r-2xl">
            <img
              src="src/assets/loginIllus.png"
              alt="Login Illustration"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Bearer token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// EndPoints
const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    const { token, user } = response.data;
    console.log(token, user);
    return { token, user }; // Return the data from the API
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data; // Return the data from the API
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

const verifyEmail = async (payload) => {
  try {
    const response = await API.post("/auth/verify-email", payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
const resendOtp = async (payload) => {
  try {
    const response = await API.post("/auth/resend-otp", payload);
    return response.data; // Return the data from the API
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Fetch tutor profile (for logged-in tutor)
const fetchTutorProfile = async () => {
  try {
    const response = await API.get("/api/tutors/profile");
    return response.data.tutor; // Return the tutor profile data
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Update tutor profile
const updateTutorProfile = async (profileData) => {
  try {
    const response = await API.put("/api/tutors/update-profile", profileData);
    return response.data.updatedTutor; // Return the updated tutor profile data
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Fetch all tutors
const fetchTutors = async (queryParams) => {
  try {
    const response = await API.get("/api/tutors", { params: queryParams });
    return response.data; // Return the data from the API
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

const fetchAllSubjects = async () => {
  try {
    const response = await API.get("/api/subjects/getAll");
    return response.data; // Return the subjects data
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// Fetch paginated tutors
const getTutors = async (page = 1, limit = 1) => {
  try {
    const response = await API.get(`/api/tutors?page=${page}&limit=${limit}`);
    return response.data; // Return tutors and pagination info
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

export {
  fetchAllSubjects,
  fetchTutorProfile,
  fetchTutors,
  getTutors,
  loginUser,
  registerUser,
  resendOtp,
  updateTutorProfile,
  verifyEmail,
};

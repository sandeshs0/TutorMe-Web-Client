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
    const response = await API.get("/api/tutors/", { params: queryParams });
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

// Fetch student profile (Authenticated student)
const fetchStudentProfile = async () => {
  try {
    const response = await API.get("/api/student/profile");
    return response.data.student; // Return the student's profile
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

const fetchStudentBookings = async () => {
  try {
    const response = await API.get("/api/student/bookings");
    return response.data.bookings; // Return the list of bookings
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

export default fetchStudentBookings;

// Update student profile
const updateStudentProfile = async (profileData) => {
  try {
    const response = await API.put("/api/student/profile", profileData, {
      headers: {
        "Content-Type": "multipart/form-data", // To handle file uploads
      },
    });
    return response.data.updatedUser; // Return the updated profile data
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
const fetchWalletBalance = async (studentId) => {
  try {
    const response = await API.get(`api/wallet/balance/${studentId}`);
    return response.data; // Return wallet balance data
  } catch (error) {
    console.error(
      "Error fetching wallet balance:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchTutor = async (username) => {
  try {
    const response = await API.get(`/api/tutors/profile/${username}`);
    return response.data; // Return tutor data
  } catch (error) {
    console.error(
      "Error fetching tutor data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const initiateWalletTransaction = async (studentId, amount, paymentGateway) => {
  try {
    const response = await API.post(`/api/transaction/initiate`, {
      studentId, // Pass studentId as a string
      amount,
      paymentGateway,
    });
    return response.data; // Return transaction initiation response
  } catch (error) {
    console.error(
      "Error initiating wallet transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const confirmWalletTransaction = async (pidx, transaction_id) => {
  try {
    console.log(
      "Inside confirmWalletTransaction api function, pidx:",
      pidx,
      transaction_id
    );
    const response = await API.post(`api/transaction/verify`, {
      pidx,
      transaction_id,
    });
    return response.data; // Return confirmation response
  } catch (error) {
    console.error(
      "Error confirming wallet transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch transaction history
const fetchWalletTransactions = async () => {
  try {
    const response = await API.get("api/transaction/history/");
    return response.data; // Return wallet transactions data
  } catch (error) {
    console.error(
      "Error fetching wallet transactions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Booking APIs
export const requestBooking = async (tutorId, date, time, note) => {
  try {
    const response = await API.post("/api/bookings/request", {
      tutorId,
      date,
      time,
      note,
    });
    return response.data; // Return success response
  } catch (error) {
    console.error(
      "Error requesting booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};
/**
 * Tutor accepts a booking.
 */
export const acceptBooking = async (bookingId) => {
  try {
    const response = await API.put(`/api/bookings/accept/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error accepting booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Tutor declines a booking.
 */
export const declineBooking = async (bookingId) => {
  try {
    const response = await API.put(`/api/bookings/decline/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error declining booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Fetch all bookings for a student.
 */
export const getStudentBookings = async () => {
  try {
    const response = await API.get("/api/bookings/student");
    return response.data.bookings;
  } catch (error) {
    console.error(
      "Error fetching student bookings:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const fetchTutorSessions = async () => {
  try {
    const response = await API.get("/api/sessions/tutor");
    return response.data.sessions; // Return the array of sessions
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
const fetchStudentSessions = async () => {
  try {
    const response = await API.get("/api/sessions/student");
    return response.data.sessions; // Return the array of sessions
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

/**
 * Fetch all bookings for a tutor.
 */
export const getTutorBookings = async () => {
  try {
    const response = await API.get("/api/bookings/tutor");
    return response.data.bookings;
  } catch (error) {
    console.error(
      "Error fetching tutor bookings:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// For Notifications:
// Fetch notifications
export const fetchNotifications = async () => {
  try {
    const response = await API.get("/api/notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark notifications as read
export const markNotificationsRead = async () => {
  try {
    await API.put("/api/notifications/mark-read");
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};

const startSession = async (bookingId) => {
  try {
    const response = await API.put(
      `/api/sessions/start/${bookingId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error starting session:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const endSession = async (bookingId) => {
  try {
    const response = await API.put(
      `/api/sessions/end/${bookingId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error ending session:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Process Payment After Session Ends
const processSessionPayment = async (bookingId) => {
  try {
    const response = await API.put(
      `api/bookings/payment/${bookingId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing session payment:", error);
    throw error;
  }
};

const getJaaSToken = async (bookingId) => {
  try {
    const response = await API.get(`/api/sessions/jaas-token/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching JaaS token:", error);
    throw error;
  }
};

export {
  confirmWalletTransaction,
  endSession,
  fetchAllSubjects,
  fetchStudentProfile,
  fetchStudentSessions,
  fetchTutor,
  fetchTutorProfile,
  fetchTutors,
  fetchTutorSessions,
  fetchWalletBalance,
  fetchWalletTransactions,
  getJaaSToken,
  getTutors,
  initiateWalletTransaction,
  loginUser,
  processSessionPayment,
  registerUser,
  resendOtp,
  startSession,
  updateStudentProfile,
  updateTutorProfile,
  verifyEmail,
};

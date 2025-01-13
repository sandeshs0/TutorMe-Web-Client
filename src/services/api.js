import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
});

// EndPoints
const loginUser = async (credentials) => {
    try {
        const response = await API.post("/auth/login", credentials);
        return response.data; // Return the data from the API
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

export { loginUser, registerUser, verifyEmail, resendOtp };

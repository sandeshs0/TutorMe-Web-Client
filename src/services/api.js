import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
});

// EndPoints
export const loginUser = async (credentials) => {
    try {
        const response = await API.post("/auth/login", credentials);
        return response.data; // Return the data from the API
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await API.post("/auth/register", userData);
        return response.data; // Return the data from the API
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

export const verifyEmail = async (payload) => {
    try {
        const response = await API.post("/auth/verify-email", payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network error" };
    }
};


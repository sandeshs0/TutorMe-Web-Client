import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error(
        "Error loading authentication data from localStorage:",
        error
      );
    } finally{
      setLoading(false);
    }
  }, []);

  const isLoggedIn = () => user !== null;
  const isTutor = () => user?.role === "tutor";
  const isStudent = () => user?.role === "student";

  const login = ({ userData, authToken }) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);
      setUser(userData);
      setToken(authToken);
    } catch (error) {
      console.error("Error saving authentication data to localStorage:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error(
        "Error clearing authentication data from localStorage:",
        error
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, isTutor, isStudent , loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

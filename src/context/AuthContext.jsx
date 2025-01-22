// import React, { createContext, useContext, useState, useEffect } from "react";

// // Create the Auth Context
// const AuthContext = createContext();

// // Auth Provider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);


//   // Load user data from localStorage when the app loads
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (userData) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom Hook to Use Auth Context
// export const useAuth = () => {
//   return useContext(AuthContext);
// };


import React, { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user and token data from localStorage when the app loads
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
      console.error("Error loading authentication data from localStorage:", error);
    }
  }, []);

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
      console.error("Error clearing authentication data from localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

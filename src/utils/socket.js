import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

// Function to register user with WebSockets
const registerSocket = (userId) => {
  if (userId) {
    socket.emit("register", userId);
    console.log(`Socket registered for user: ${userId}`);
  }
};

export { socket, registerSocket };

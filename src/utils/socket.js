import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log(" Connected to WebSocket Server:", socket.id);
});

socket.on("disconnect", () => {
  console.log(" Disconnected from WebSocket Server");
});

// Function to register user with WebSockets
const registerSocket = (userId) => {
  if (userId) {
    console.log(`Emitting register event for user: ${userId}`);
    socket.emit("register", userId);
  } else {
    console.log(" No userId provided for socket registration.");
  }
};

export { socket, registerSocket };

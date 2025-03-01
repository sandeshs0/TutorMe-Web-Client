// import { JitsiMeeting } from "@jitsi/react-sdk";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { endSession, getJaaSToken } from "../services/api"; // API Calls

// const JitsiMeetComponent = ({
//   sessionRoom,
//   bookingId,
//   onClose,
//   user,
//   isTutor,
// }) => {
//   const [roomName, setRoomName] = useState("");
//   const [jwtToken, setJwtToken] = useState("");

//   console.log("🔹 Received sessionRoom prop:", sessionRoom);

//   useEffect(() => {
//     toast.info("You have joined the session.", { position: "bottom-right" });

//     // ✅ Debugging: Ensure sessionRoom is received properly
//     console.log("🔹 Full Session Room URL:", sessionRoom);

//     if (sessionRoom) {
//       const extractedRoomName = sessionRoom.split("/").pop(); // Extract Jitsi room name
//       console.log("✅ Extracted Jitsi Room Name:", extractedRoomName);
//       setRoomName(extractedRoomName);
//     } else {
//       console.error("❌ Session room is undefined or null.");
//     }

//     // Fetch JWT token from the backend
//     const fetchToken = async () => {
//       try {
//         const response = await getJaaSToken(bookingId);
//         setJwtToken(response.token);
//       } catch (error) {
//         console.error("❌ Failed to fetch Jitsi JWT token:", error);
//       }
//     };

//     fetchToken();

//     return () => {
//       toast.info("Session ended.", { position: "bottom-right" });
//     };
//   }, [sessionRoom, bookingId]);

//   // ✅ Function to end session (Only Tutor can end it)
//   const handleEndSession = async () => {
//     if (!isTutor) {
//       toast.error("Only tutors can end the session.");
//       return;
//     }

//     try {
//       await endSession(bookingId);
//       toast.success("Session has been ended successfully!");
//       onClose();
//     } catch (error) {
//       console.error("❌ Error ending session:", error);
//       toast.error("Failed to end session.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//       <div className="w-[95vw] h-[95vh] flex flex-col">
//         {" "}
//         {/* Increased to 95% */}
//         {/* Header section with buttons */}
//         <div className="flex justify-between p-4 bg-gray-800">
//           {isTutor && (
//             <button
//               className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md"
//               onClick={handleEndSession}
//             >
//               End Session
//             </button>
//           )}
//           <button
//             className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
//             onClick={onClose}
//           >
//             Close
//           </button>
//         </div>
//         {/* Main Jitsi container */}
//         <div className="flex-1 w-full h-full">
//           {" "}
//           {/* This will expand to fill available space */}
//           {roomName && jwtToken ? (
//             <JitsiMeeting
//               domain="8x8.vc" // JaaS domain
//               roomName={roomName}
//               jwt={jwtToken} // Secure JWT authentication
//               configOverwrite={{
//                 startWithAudioMuted: false,
//                 disableModeratorIndicator: false,
//                 enableEmailInStats: false,
//                 prejoinPageEnabled: false,
//                 requireDisplayName: false,
//                 filmStripOnly: false,
//               }}
//               interfaceConfigOverwrite={{
//                 DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
//                 MOBILE_APP_PROMO: false,
//                 SHOW_CHROME_EXTENSION_BANNER: false,
//                 TOOLBAR_BUTTONS: [
//                   "microphone",
//                   "camera",
//                   "desktop",
//                   "fullscreen",
//                   "hangup",
//                   "profile",
//                   "chat",
//                   "settings",
//                 ],
//               }}
//               userInfo={{
//                 displayName: user.name || "Guest",
//               }}
//               getIFrameRef={(iframeRef) => {
//                 iframeRef.style.height = "100%";
//                 iframeRef.style.width = "100%";
//               }}
//             />
//           ) : (
//             <p className="text-white text-xl font-bold">
//               ⚠️ Error: Room Name or Token Not Found
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JitsiMeetComponent;

// JitsiMeetComponent.jsx
import { JitsiMeeting } from "@jitsi/react-sdk";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { endSession, getJaaSToken } from "../services/api";

const JitsiMeetComponent = ({
  sessionRoom,
  bookingId,
  onClose,
  user,
  isTutor,
}) => {
  const [jwtToken, setJwtToken] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await getJaaSToken(bookingId);
        setJwtToken(response.token);
        toast.success("Joined session successfully!", {
          position: "bottom-right",
        });
      } catch (error) {
        console.error("Failed to fetch Jitsi JWT token:", error);
        setError("Failed to join session. Please try again.");
        toast.error("Failed to join session.", { position: "bottom-right" });
      }
    };

    fetchToken();

    // // Ensure the Jitsi script is loaded correctly
    // const script = document.createElement("script");
    // script.src = "https://8x8.vc/libs/external_api.js"; // Correct Jitsi script URL
    // script.async = true;
    // script.onerror = () => {
    //   console.error("Failed to load Jitsi script");
    //   setError("Failed to load video session. Please check your network and try again.");
    //   toast.error("Failed to load video session.");
    // };
    // document.body.appendChild(script);

    return () => {
      toast.info("Session ended.", { position: "bottom-right" });
    };
  }, [bookingId]);

  const handleEndSession = async () => {
    if (!isTutor) {
      toast.error("Only tutors can end the session.");
      return;
    }
    try {
      await endSession(bookingId);
      toast.success("Session ended successfully!");
      onClose();
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to end session.");
    }
  };

  const handleApiReady = (api) => {
    api.addListener("passwordRequired", () => {
      toast.error("Authentication failed. Invalid credentials.");
      setError("Authentication failed.");
    });
    api.addListener("videoConferenceJoined", () => {
      console.log("Successfully joined conference");
    });
    api.addListener("connectionFailed", (error) => {
      toast.error(`Connection failed: ${error.message}`);
      setError("Connection failed.");
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="w-[95vw] h-[95vh] flex flex-col">
        <div className="flex justify-between p-4 bg-gray-800">
          {isTutor && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md"
              onClick={handleEndSession}
            >
              End Session
            </button>
          )}
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex-1 w-full h-full">
          {jwtToken && !error ? (
            <JitsiMeeting
              domain="8x8.vc"
              roomName={sessionRoom} // Full room ID (e.g., <tenant>/<bookingId>)
              jwt={jwtToken}
              configOverwrite={{
                startWithAudioMuted: false,
                prejoinPageEnabled: false,
                requireDisplayName: false,
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                MOBILE_APP_PROMO: false,
                TOOLBAR_BUTTONS: [
                  "microphone",
                  "camera",
                  "desktop",
                  "fullscreen",
                  "hangup",
                  "chat",
                ],
              }}
              userInfo={{ displayName: user.name || "Guest" }}
              getIFrameRef={(iframeRef) => {
                iframeRef.style.height = "100%";
                iframeRef.style.width = "100%";
              }}
              onApiReady={handleApiReady}
              onReadyToClose={onClose}
            />
          ) : (
            <p className="text-white text-xl font-bold">
              {error || "Loading session..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JitsiMeetComponent;

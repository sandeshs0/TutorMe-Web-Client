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

    // const script = document.createElement("script");
    // script.src = "https://8x8.vc/libs/external_api.js";
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

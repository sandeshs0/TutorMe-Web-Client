import React, { useEffect, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { toast } from "react-toastify";
import { startSession, endSession } from "../services/api"; // API Calls

const JitsiMeetComponent = ({ sessionRoom, bookingId, onClose, user, isTutor }) => {
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    toast.info("You have joined the session.", { position: "bottom-right" });

    // ✅ Debugging: Ensure sessionRoom is received properly
    console.log("🔹 Full Session Room URL:", sessionRoom);

    if (sessionRoom) {
      const extractedRoomName = sessionRoom.split("/").pop(); // Extract Jitsi room name
      console.log("✅ Extracted Jitsi Room Name:", extractedRoomName);
      setRoomName(extractedRoomName);
    } else {
      console.error("❌ Session room is undefined or null.");
    }

    return () => {
      toast.info("Session ended.", { position: "bottom-right" });
    };
  }, [sessionRoom]);

  // ✅ Function to end session (Only Tutor can end it)
  const handleEndSession = async () => {
    if (!isTutor) {
      toast.error("Only tutors can end the session.");
      return;
    }

    try {
      await endSession(bookingId);
      toast.success("Session has been ended successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Error ending session:", error);
      toast.error("Failed to end session.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* ✅ Debugging: Show error if roomName is missing */}
        {roomName ? (
          <>
            <JitsiMeeting
              roomName={roomName}
              configOverwrite={{
                startWithAudioMuted: false,
                disableModeratorIndicator: false,
                enableEmailInStats: false,
              }}
              interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
              }}
              userInfo={{
                displayName: user.name,
              }}
            />
          </>
        ) : (
          <p className="text-white text-xl font-bold">
            ⚠️ Error: Room Name Not Found
          </p>
        )}

        {/* End Session Button - Only for Tutors */}
        {isTutor && (
          <button
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md"
            onClick={handleEndSession}
          >
            End Session
          </button>
        )}

        {/* Close Button */}
        <button
          className="absolute top-5 right-5 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default JitsiMeetComponent;

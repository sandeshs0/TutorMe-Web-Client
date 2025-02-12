import React, { useEffect, useRef } from "react";

const VideoCall = ({ roomName, displayName, onClose }) => {
  const jitsiContainer = useRef(null);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      console.error("Jitsi Meet API is not loaded.");
      return;
    }

    const domain = "meet.jit.si"; // Free Jitsi server
    const options = {
      roomName: roomName, // Unique session name
      width: "100%",
      height: "100%",
      parentNode: jitsiContainer.current,
      userInfo: {
        displayName: displayName, // Tutor/Student name
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    api.addEventListener("videoConferenceLeft", () => {
      onClose(); // Close video on exit
    });

    return () => api.dispose(); // Cleanup
  }, [roomName, displayName, onClose]);

  return <div ref={jitsiContainer} className="w-full h-full" />;
};

export default VideoCall;

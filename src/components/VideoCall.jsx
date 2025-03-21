import React, { useEffect, useRef } from "react";

const VideoCall = ({ roomName, displayName, onClose }) => {
  const jitsiContainer = useRef(null);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      console.error("Jitsi Meet API is not loaded.");
      return;
    }

    const domain = "meet.jit.si"; 
    const options = {
      roomName: roomName,
      width: "100%",
      height: "100%",
      parentNode: jitsiContainer.current,
      userInfo: {
        displayName: displayName, 
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    api.addEventListener("videoConferenceLeft", () => {
      onClose(); 
    });

    return () => api.dispose(); 
  }, [roomName, displayName, onClose]);

  return <div ref={jitsiContainer} className="w-full h-full" />;
};

export default VideoCall;

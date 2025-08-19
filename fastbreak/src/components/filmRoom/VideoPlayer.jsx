import React, { useEffect, useRef, forwardRef } from "react";
import "./VideoPlayer.css";

const VideoPlayer = forwardRef(function VideoPlayer({ videoUrl, seekTo, onSeeked }, ref) {
    const localRef = useRef();
    // Always attach the ref to the video element
    useEffect(() => {
        if (ref) {
            if (typeof ref === "function") {
                ref(localRef.current);
            } else {
                ref.current = localRef.current;
            }
        }
    }, [ref]);

    useEffect(() => {
        if (
            seekTo != null &&
            localRef.current &&
            typeof localRef.current.currentTime === "number"
        ) {
            localRef.current.currentTime = seekTo;
            if (onSeeked) onSeeked();
        }
    }, [seekTo, onSeeked]);

    if (!videoUrl) {
        return <div style={{ textAlign: "center", padding: "2rem" }}>No video available.</div>;
    }

    return (
        <video
            ref={localRef}
            src={videoUrl}
            controls
            style={{ width: "100%", height: "auto" }}
        />
    );
});

export default VideoPlayer;

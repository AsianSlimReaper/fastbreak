import React, { useEffect, useRef, forwardRef } from "react";
import "./VideoPlayer.css";

const VideoPlayer = forwardRef(function VideoPlayer({ videoUrl, seekTo, onSeeked }, ref) {
    const localRef = useRef();
    const videoElementRef = ref || localRef;

    useEffect(() => {
        if (
            seekTo != null &&
            videoElementRef.current &&
            typeof videoElementRef.current.currentTime === "number"
        ) {
            videoElementRef.current.currentTime = seekTo;
            if (onSeeked) onSeeked();
        }
    }, [seekTo, onSeeked, videoElementRef]);

    if (!videoUrl) {
        return <div style={{ textAlign: "center", padding: "2rem" }}>No video available.</div>;
    }

    return (
        <video
            ref={videoElementRef}
            src={videoUrl}
            controls
            style={{ width: "100%", height: "auto" }}
        />
    );
});

export default VideoPlayer;

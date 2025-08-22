import React, { useEffect, useRef, forwardRef } from "react";
import "./VideoPlayer.css";

const VideoPlayer = forwardRef(function VideoPlayer({ videoUrl, seekTo, onSeeked }, ref) {
    // initialize a local ref to hold the video element
    const localRef = useRef();
    // attach the local ref to the forwarded ref
    useEffect(() => {
        //check if ref is provided
        if (ref) {
            //check if ref is a function or an object
            if (typeof ref === "function") {
                // if it's a function, call it with the local ref
                ref(localRef.current);
            } else {
                // if it's an object, assign the local ref to it
                ref.current = localRef.current;
            }
        }
    }, [ref]); //call when ref changes

    // useEffect to handle seeking to a specific time in the video
    useEffect(() => {
        // check if seekTo is provided and localRef is set
        if (
            seekTo != null &&
            localRef.current &&
            typeof localRef.current.currentTime === "number"
        ) {
            // seek to the specified time
            localRef.current.currentTime = seekTo;
            if (onSeeked) onSeeked();
        }
    }, [seekTo, onSeeked]); // call when seekTo or onSeeked changes

    // check if videoUrl is provided
    if (!videoUrl) {
        // if not, return a message indicating no video is available
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

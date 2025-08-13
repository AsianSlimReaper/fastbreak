import React from "react";
import "./VideoPlayer.css";
import ReactPlayer from 'react-player'

function VideoPlayer({videoUrl}){
    return(
        <ReactPlayer
            url={videoUrl}
            controls={true}
            playing={false}
            width="100%"
            height="auto"
            volume={1}
            muted={false}
            loop={false}
            onError={(e) => console.error("Video playback error:", e)}
        />
    )
}

export default VideoPlayer
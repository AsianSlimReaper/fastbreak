import React from "react";
import "./PlayByPlayTable.css";

function formatTimestamp(seconds) {
    if (typeof seconds !== "number" || isNaN(seconds)) return "";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

const PlayByPlayTable = ({ playByPlay, currentTime, onPlayClick }) => {
    // Find the closest play to the current time
    let highlightIdx = -1;
    // check if playByPlay is an array and has elements
    if (Array.isArray(playByPlay) && playByPlay.length > 0) {
        // fine the index of the play that is closest to the current time
        highlightIdx = playByPlay.findIndex(
            // set the condition to find the play that is closest to the current time
            (p, idx) =>
                p.timestamp_seconds <= currentTime &&
                (idx === playByPlay.length - 1 || playByPlay[idx + 1].timestamp_seconds > currentTime)
        );
    }
    return (
        <div className="pbp-table-scroll">
            <table className="pbp-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Event</th>
                    </tr>
                </thead>
                <tbody>
                    {playByPlay.map((play, idx) => (
                        <tr
                            key={play.id || `${play.timestamp_seconds}-${play.event_type}`}
                            className={highlightIdx === idx ? "pbp-row-highlight" : ""}
                            onClick={() => onPlayClick && onPlayClick(play.timestamp_seconds)}
                            style={onPlayClick ? { cursor: "pointer" } : undefined}
                        >
                            <td>{formatTimestamp(play.timestamp_seconds)}</td>
                            <td>{play.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayByPlayTable;

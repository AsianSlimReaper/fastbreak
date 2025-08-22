import React from "react";
import "./AnalysisTable.css";


//purpose: Formats a timestamp in seconds to a string in the format "MM:SS"
//input: seconds (number) - The timestamp in seconds
//output: A string formatted as "MM:SS" or an empty string if the input is invalid
function formatTimestamp(seconds) {
    // Check if the input is a valid number
    if (typeof seconds !== "number" || isNaN(seconds)) return "";
    // declare min and sec variables by dividing seconds by 60 and getting the remainder
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    // Return the formatted string
    return `${min}:${sec.toString().padStart(2, "0")}`;
}


const AnalysisTable = ({ comments, onCommentClick }) => {
    // Check if comments is an array and has elements
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
        // If comments is empty or not an array, return a message indicating no comments are available
        return <div className="analysis-table-empty">No comments available.</div>;
    }

    return (
        <table className="analysis-table">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                {comments.map((comment) => (
                    <tr
                        key={comment.id || `${comment.timestamp_seconds}-${comment.text}`}
                        className={onCommentClick ? "analysis-table-row-clickable" : ""}
                        onClick={() => onCommentClick && onCommentClick(comment.timestamp_seconds)}
                        style={onCommentClick ? { cursor: "pointer" } : undefined}
                    >
                        <td>{formatTimestamp(comment.timestamp_seconds)}</td>
                        <td>{comment.comment_text}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AnalysisTable;

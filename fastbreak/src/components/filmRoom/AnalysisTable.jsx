import React from "react";
import "./AnalysisTable.css";

function formatTimestamp(seconds) {
    if (typeof seconds !== "number" || isNaN(seconds)) return "";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

const AnalysisTable = ({ comments, onCommentClick }) => {
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
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

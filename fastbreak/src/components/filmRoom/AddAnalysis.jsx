import React, { useState } from "react";
import "./AddAnalysis.css";
import ButtonComponent from "../universal/ButtonComponent.jsx";

function AddAnalysis({ onAddComment, currentTime }) {
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            // If currentTime is a function, call it to get the latest time
            const timestamp = typeof currentTime === "function" ? currentTime() : currentTime;
            onAddComment(comment, timestamp);
            setComment("");
        }
    };

    return (
        <form className="add-analysis-form" onSubmit={handleSubmit}>
            <textarea
                className="add-analysis-textarea"
                placeholder="Enter comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={2}
            />
            <ButtonComponent className="add-analysis-btn" type="submit">Save Comment</ButtonComponent>
        </form>
    );
}

export default AddAnalysis;

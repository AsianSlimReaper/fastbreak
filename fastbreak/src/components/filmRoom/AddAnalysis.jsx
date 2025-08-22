import React, { useState } from "react";
import "./AddAnalysis.css";
import ButtonComponent from "../universal/ButtonComponent.jsx";

//input: onAddComment (function to call when comment is added), currentTime (current time in the video)
//output: A form with a textarea for adding comments and a button to submit the comment
function AddAnalysis({ onAddComment, currentTime }) {
    // State to hold the comment text
    const [comment, setComment] = useState("");

    // Function to handle form submission
    //input: e (event object)
    //output: Prevents default form submission, checks if comment is not empty, calls onAddComment with comment and currentTime, resets comment state
    const handleSubmit = (e) => {
        // Prevent default form submission behavior
        e.preventDefault();
        if (comment.trim()) {
            // If currentTime is a function, call it to get the latest time
            const timestamp = typeof currentTime === "function" ? currentTime() : currentTime;
            // Call the onAddComment function with the comment and timestamp
            onAddComment(comment, timestamp);
            // Reset the comment state to an empty string
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

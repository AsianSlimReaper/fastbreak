import React from "react";
import './PlayerAvatar.css';

// taken from uiverse
function getInitials(name) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0];
    return parts[0][0] + parts[1][0];
}

function PlayerAvatar({ name }) {
    return (
        <div className="player-avatar">
            <span>{getInitials(name)}</span>
        </div>
    );
}

export default PlayerAvatar
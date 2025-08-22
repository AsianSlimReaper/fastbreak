import React from "react";
import "./StatsNav.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function StatsNav() {
    // Using React Router hooks to manage navigation and access route parameters
    const navigate = useNavigate();
    // Extracting the current team ID from the URL parameters
    const { teamId: currentTeamId } = useParams();
    // Using useLocation to determine the current path for active tab styling
    const location = useLocation();

    // Defining the tabs for the stats navigation
    const tabs = [
        { label: "Basic Stats", path: "basic" },
        { label: "Shooting", path: "shooting" }
    ];

    // Function to determine the class for each button based on the current path
    const getButtonClass = (path) => {
        // Check if the current path matches the button's path
        return location.pathname.includes(`/stats/${path}`) ? "stats-nav-button active-tab" : "stats-nav-button";
    };

    return (
        <nav className="stats-nav">
            {tabs.map((tab) => (
                <button
                    key={tab.path}
                    className={getButtonClass(tab.path)}
                    onClick={() => navigate(`/stats/${tab.path}/${currentTeamId}`)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
}

export default StatsNav;

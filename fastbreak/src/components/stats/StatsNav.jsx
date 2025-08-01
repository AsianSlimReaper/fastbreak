import React from "react";
import "./StatsNav.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function StatsNav() {
    const navigate = useNavigate();
    const { teamId: currentTeamId } = useParams();
    const location = useLocation();

    const tabs = [
        { label: "Basic Stats", path: "basic" },
        { label: "Shooting", path: "shooting" }
    ];

    const getButtonClass = (path) => {
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

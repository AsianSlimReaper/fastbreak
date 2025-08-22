import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import './SideNav.css';

function SideNav() {
    // Using hooks to access navigation and location
    const navigate = useNavigate();
    const location = useLocation();
    const { teamId } = useParams(); 

    // Function to handle navigation based on the section clicked
    const navigateTo = (section) => {
        // If no teamId is present and the section is not 'teams', do not navigate
        if (!teamId && section !== "teams") {
            return;
        }

        // Define the routes based on the section clicked
        const routes = {
            teams: '/teams/',
            dashboard: `/dashboard/team/${teamId}`,
            stats: `/stats/basic/${teamId}`,
            profile: `/player-profile/team/${teamId}`,
            film: `/film-room/team/${teamId}`,
        };

        // Navigate to the appropriate route
        navigate(routes[section]);
    };

    // Function to determine if the button should be highlighted as active
    const buttonIsSelected = (section) => {
        // Check if the current path includes the section name
        return location.pathname.includes(section) ? 'active-module' : '';
    };

    return (
        <div className="side-nav">
            <button
                onClick={() => navigateTo("teams")}
                className={buttonIsSelected('teams')}
            >
                Teams
            </button>
            <button
                onClick={() => navigateTo("dashboard")}
                className={buttonIsSelected('dashboard')}
            >
                Dashboard
            </button>
            <button
                onClick={() => navigateTo("stats")}
                className={buttonIsSelected('stats')}
            >
                Stats
            </button>
            <button
                onClick={() => navigateTo("profile")}
                className={buttonIsSelected('profile')}
            >
                Player Profiles
            </button>
            <button
                onClick={() => navigateTo("film")}
                className={buttonIsSelected('film')}
            >
                Film Room
            </button>
        </div>
    );
}

export default SideNav;

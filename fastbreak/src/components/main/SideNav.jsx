import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import './SideNav.css';

function SideNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { teamId } = useParams(); 

    const navigateTo = (section) => {
        if (!teamId && section !== "teams") {
            return;
        }

        const routes = {
            teams: '/teams/',
            dashboard: `/dashboard/team/${teamId}`,
            stats: `/stats/basic/${teamId}`,
            profile: `/player-profile/team/${teamId}`,
            film: `/film-room/team/${teamId}`,
        };

        navigate(routes[section]);
    };

    const buttonIsSelected = (section) => {
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

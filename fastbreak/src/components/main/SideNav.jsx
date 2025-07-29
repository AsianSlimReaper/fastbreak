import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './SideNav.css'

function SideNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const pathParts = location.pathname.split("/");
    const currentTeamId = pathParts.includes("team") ? pathParts.at(-1) : null;

    const navigateTo = (section) => {
        if (!currentTeamId && section !== "dashboard") {
            return;
        }

        const routes = {
            teams: '/teams',
            dashboard: currentTeamId ? `/dashboard/team/${currentTeamId}` : "/dashboard",
            stats: `/stats/team/${currentTeamId}`,
            profile: `/player-profile/team/${currentTeamId}`,
            film: `/film-room/team/${currentTeamId}`,
        };

        navigate(routes[section]);
    };

    const buttonIsSelected =(section)=>{
        if(location.pathname.includes(section)){
            return location.pathname.includes(section) ? 'active-module' : '';
        }
    }

    return (
        <div className="side-nav">
            <button
                onClick={() => navigateTo("teams")}
                className={buttonIsSelected('teams')}>
                Teams
           </button>
            <button
                onClick={() => navigateTo("dashboard")}
                className={buttonIsSelected('dashboard')}>
                Dashboard
            </button>
            <button
                onClick={() => navigateTo("stats")}
                className={buttonIsSelected('stats')}>Stats
            </button>
            <button
                onClick={() => navigateTo("profile")}
                className={buttonIsSelected('profile')}>Player Profiles
            </button>
            <button
                onClick={() => navigateTo("film")}
                className={buttonIsSelected('film')}>Film Room
            </button>
        </div>
    );
}

export default SideNav;

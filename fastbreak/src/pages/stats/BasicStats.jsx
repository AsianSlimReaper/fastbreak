import React, { useEffect, useState } from 'react';
import './BasicStats.css';
import { useParams } from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import Loader from "../../components/universal/Loader.jsx";

function BasicStats() {
    const { teamId } = useParams();

    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const storedTeams = JSON.parse(localStorage.getItem("teams"));
                if (!storedTeams || !teamId) return;

                setTeams(storedTeams);

                const matched = storedTeams.find(m => m.team.id === teamId);
                setCurrentTeam(matched ? matched.team : null);
            } catch (error) {
                console.error("Error loading teams:", error);
            }
        };

        fetchTeams();
        }, [teamId]);

    return (
        <>
            <MainLayout teams={teams} currentTeam={currentTeam} />
            <div className="basic-stats-content">
                {currentTeam ? (
                    <h2>{currentTeam.team_name} - Basic Stats</h2>
                ) : (
                    <Loader />
                )}
            </div>
        </>
    );
}

export default BasicStats;

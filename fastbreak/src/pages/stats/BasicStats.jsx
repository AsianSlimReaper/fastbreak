import React, { useEffect, useState } from 'react';
import './BasicStats.css';
import { useParams } from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import Loader from "../../components/universal/Loader.jsx";
import StatsNav from "../../components/stats/StatsNav.jsx";
import { getIndividualStats, getTeamStats } from "../../services/statsAPI.js";
import IndividualBasicStats from "../../components/stats/IndividualBasicStats.jsx";
import TeamBasicStats from "../../components/stats/TeamBasicStats.jsx";

function BasicStats() {
    const token = localStorage.getItem("access_token");
    const { teamId } = useParams();

    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [teamStats, setTeamStats] = useState({
        "wins": 0,
        "losses": 0,
        "draws": 0,
        "points_for": 0.0,
        "points_against": 0.0,
        "ast": 0.0,
        "oreb": 0.0,
        "dreb": 0.0,
        "reb": 0.0,
        "stl": 0.0,
        "blk": 0.0,
        "tov": 0.0,
        "fls": 0.0,
        "off_rtg": 0.0,
        "def_rtg": 0.0,
        "net_rtg": 0.0,
        "pace": 0.0});
    const [individualStats, setIndividualStats] = useState([]);

    useEffect(() => {
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        if (storedTeams && teamId) {
            setTeams(storedTeams);
            const matched = storedTeams.find(m => m.team.id === teamId);
            if (matched) {
                setCurrentTeam(matched.team);
            }
        }
    }, [teamId]);

    useEffect(() => {
        const fetchStats = async () => {
            if (!currentTeam) return;

            try {
                const teamData = await getTeamStats(currentTeam.id, token);
                setTeamStats(teamData);

                const individualData = await getIndividualStats(currentTeam.id, token);
                setIndividualStats(individualData);
            } catch (error) {
                console.error("Error loading stats:", error);
            }
        };

        fetchStats();
    }, [currentTeam, token]);

    return (
        <MainLayout teams={teams} currentTeam={currentTeam}>
            <div className="basic-stats-content">
                {currentTeam ? (
                    <>
                        <StatsNav />
                        <IndividualBasicStats stats={individualStats} />
                        <TeamBasicStats stats={teamStats}/>
                    </>
                ) : (
                    <Loader />
                )}
            </div>
        </MainLayout>
    );
}

export default BasicStats;

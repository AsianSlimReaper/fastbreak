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
    // Retrieve the access token from local storage
    const token = localStorage.getItem("access_token");
    // get the teamId from the URL parameters
    const { teamId } = useParams();

    // State variables to hold teams, current team, team stats, and individual stats
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

    // Load teams from local storage and set the current team based on the teamId
    useEffect(() => {
        // Retrieve teams from local storage
        const storedTeams = JSON.parse(localStorage.getItem("teams"));

        // If teams are stored and a teamId is provided, set the teams state and find the current team
        if (storedTeams && teamId) {
            // Filter teams to find the one that matches the teamId
            setTeams(storedTeams);
            // Find the team that matches the teamId
            const matched = storedTeams.find(m => m.team.id === teamId);
            // If a matching team is found, set it as the current team
            if (matched) {
                setCurrentTeam(matched.team);
            }
        }
    }, [teamId]); // run this effect when teamId changes

    // Fetch team and individual stats when the current team is set
    useEffect(() => {
        const fetchStats = async () => {
            // If no current team is set, exit the function
            if (!currentTeam) return;

            try {
                // Fetch team stats and individual stats using the current team's ID and the access token
                const teamData = await getTeamStats(currentTeam.id, token);
                setTeamStats(teamData);

                const individualData = await getIndividualStats(currentTeam.id, token);
                setIndividualStats(individualData);
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("Error loading stats:", error);
            }
        };

        fetchStats();
    }, [currentTeam, token]);

    return (
        <MainLayout teams={teams}>
            <div className="basic-stats-content">
                {individualStats && teamStats ? (
                    <>
                        <StatsNav />
                            <div className='basic-stats-wrapper'>
                                <div className='individual-basic-stats-wrapper'>
                                <IndividualBasicStats stats={individualStats} />
                            </div>
                            <div className='team-basic-stats-wrapper'>
                                <TeamBasicStats stats={teamStats}/>
                            </div>
                        </div>
                    </>
                ) : (
                    <Loader />
                )}
            </div>
        </MainLayout>
    );
}

export default BasicStats;

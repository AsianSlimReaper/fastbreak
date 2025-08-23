import React, {useEffect, useState} from "react";
import "./ShootingStats.css"
import {useParams} from "react-router-dom";
import {getIndividualShootingStats, getTeamShootingStats} from "../../services/statsAPI.js";
import MainLayout from "../../components/main/MainLayout.jsx";
import StatsNav from "../../components/stats/StatsNav.jsx";
import Loader from "../../components/universal/Loader.jsx";
import IndividualShootingStats from "../../components/stats/IndividualShootingStats.jsx";
import TeamShootingStats from "../../components/stats/TeamShootingStats.jsx";

function ShootingStats(){
    // Get the access token from local storage
    const token = localStorage.getItem("access_token");
    // Get the team ID from the URL parameters
    const {teamId} = useParams()

    // State variables to hold teams, current team, team stats, and individual stats
    const [teams, setTeams] = useState([])
    const [currentTeam, setCurrentTeam] = useState(null)
    const [teamStats, setTeamStats] = useState({
        "fgm": 0.0,
        "fga": 0.0,
        "fg_pct": 0.0,
        "twopm": 0.0,
        "twopa": 0.0,
        "twop_pct": 0.0,
        "threepm": 0.0,
        "threepa": 0.0,
        "threep_pct": 0.0,
        "ftm": 0.0,
        "fta": 0.0,
        "ft_pct": 0.0,
        "efg_pct": 0.0,
        "ts_pct": 0.0
    })
    const [individualStats, setIndividualStats] = useState([])

    // Load teams from local storage and set the current team based on the teamId parameter
    useEffect(() => {
        // get teams from local storage
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        // If teams are stored and teamId is provided, set the teams state and find the current team
        if (storedTeams && teamId) {
            setTeams(storedTeams);
            // Find the team that matches the teamId
            const matched = storedTeams.find(m => m.team.id === teamId);
            if (matched) {
                // Set the current team to the matched team
                setCurrentTeam(matched.team);
            }
        }
    }, [teamId]); // run when teamId changes

    // Fetch shooting stats for the current team and individual players when the current team changes
    useEffect(() => {
        const fetchStats = async () => {
            // If there is no current team, exit the function
            if (!currentTeam) return;

            try {
                // Fetch team and individual shooting stats using the API services
                const teamData = await getTeamShootingStats(currentTeam.id, token);
                // Set the team stats state with the fetched data
                setTeamStats(teamData);

                // Fetch individual shooting stats for the current team
                const individualData = await getIndividualShootingStats(currentTeam.id, token);
                // Set the individual stats state with the fetched data
                setIndividualStats(individualData);
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("Error loading stats:", error);
            }
        };

        // Call the fetchStats function to load the stats
        fetchStats();
    }, [currentTeam, token]); // run when currentTeam or token changes

    return(
        <>
            <MainLayout teams={teams}>
                <div className="shooting-stats-content">
                    {currentTeam ? (
                        <>
                            <StatsNav />
                            <div className='shooting-stats-wrapper'>
                                <IndividualShootingStats stats={individualStats}/>
                                <TeamShootingStats stats={teamStats}/>
                            </div>
                        </>
                    ) : (
                        <Loader />
                    )}
                </div>
            </MainLayout>
        </>
    )
}

export default ShootingStats;
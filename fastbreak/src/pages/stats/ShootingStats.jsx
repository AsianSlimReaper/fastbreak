import React, {use, useEffect, useState} from "react";
import "./ShootingStats.css"
import {useParams} from "react-router-dom";
import {getIndividualShootingStats, getTeamShootingStats} from "../../services/statsAPI.js";
import MainLayout from "../../components/main/MainLayout.jsx";
import StatsNav from "../../components/stats/StatsNav.jsx";
import Loader from "../../components/universal/Loader.jsx";
import IndividualShootingStats from "../../components/stats/IndividualShootingStats.jsx";

function ShootingStats(){
    const token = localStorage.getItem("access_token");
    const {teamId} = useParams()

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
    const [IndividualStats, setIndividualStats] = useState([])

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
                const teamData = await getTeamShootingStats(currentTeam.id, token);
                setTeamStats(teamData);

                const individualData = await getIndividualShootingStats(currentTeam.id, token);
                setIndividualStats(individualData);
            } catch (error) {
                console.error("Error loading stats:", error);
            }
        };

        fetchStats();
    }, [currentTeam, token]);

    return(
        <>
            <MainLayout teams={teams} setCurrentTeam={setCurrentTeam}>
                <div className="shooting-stats-content">
                    {currentTeam ? (
                        <>
                            <StatsNav />
                            <IndividualShootingStats stats={IndividualStats}/>
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
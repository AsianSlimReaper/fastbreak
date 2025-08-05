import React, {useEffect, useState} from "react";
import "./PlayerProfile.css";
import {useParams} from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import {getPlayerProfile} from "../../services/playerProfile.js";
import PlayerProfileHeader from "../../components/player_profile/PlayerProfileHeader.jsx";
import Loader from "../../components/universal/Loader.jsx";
import PlayerProfileBody from "../../components/player_profile/PlayerProfileBody.jsx";

function PlayerProfile(){
    const token = localStorage.getItem("access_token");
    const { teamId,userId } = useParams();
    const [currentTeam,setCurrentTeam] = useState();
    const [teams, setTeams] = useState([]);
    const [player, setPlayerProfile] = useState(null);

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
        const fetchPlayerProfile = async() => {
            try{
             const playerProfileData = await getPlayerProfile(teamId,userId, token);

             setPlayerProfile(playerProfileData);
            } catch(error) {
                console.error("Error fetching player profile:", error);
            }
        };
        fetchPlayerProfile()
    }, [teamId,userId,token]);

    return(
        <>
            {player?(
            <MainLayout teams={teams}>
                <div className='player-profile-wrapper'>
                    <PlayerProfileHeader player={player.player} team={currentTeam} stats={player.stats} />
                    <PlayerProfileBody stats={player.stats} recentGames={player.recent_games}/>
                </div>
            </MainLayout>):(
                <div className='player-profile-loader'>
                    <Loader/>
                </div>
            )
            }
        </>
    )
}

export default PlayerProfile;
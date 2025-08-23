import React, {useEffect, useState} from "react";
import "./PlayerProfile.css";
import {useParams} from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import {getPlayerProfile} from "../../services/playerProfile.js";
import PlayerProfileHeader from "../../components/player_profile/PlayerProfileHeader.jsx";
import Loader from "../../components/universal/Loader.jsx";
import PlayerProfileBody from "../../components/player_profile/PlayerProfileBody.jsx";

function PlayerProfile(){
    // Get the token from localStorage
    const token = localStorage.getItem("access_token");
    //get the teamId and userId from the URL parameters
    const { teamId,userId } = useParams();
    // Initialize state variables
    const [currentTeam,setCurrentTeam] = useState();
    const [teams, setTeams] = useState([]);
    const [player, setPlayerProfile] = useState(null);

    // Fetch the teams from localStorage and set the current team based on the teamId
    useEffect(() => {
        // Check if the teamId is present in the URL parameters
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        // If teams are stored in localStorage and teamId is provided, set the teams and current team
        if (storedTeams && teamId) {
            // Filter the teams to find the one that matches the teamId
            setTeams(storedTeams);
            const matched = storedTeams.find(m => m.team.id === teamId);
            // If a matching team is found, set it as the current team
            if (matched) {
                setCurrentTeam(matched.team);
            }
        }
    }, [teamId]); // run this effect when teamId changes

    // Fetch the player profile data using the teamId and userId
    useEffect(() => {
        const fetchPlayerProfile = async() => {
            try{
                // get the player profile data from the API
             const playerProfileData = await getPlayerProfile(teamId,userId, token);

             // Set the player profile data to the state
             setPlayerProfile(playerProfileData);
            } catch(error) {
                // Log any errors that occur during the fetch
                console.error("Error fetching player profile:", error);
            }
        };
        // Call the fetchPlayerProfile function to initiate the data fetch
        fetchPlayerProfile()
    }, [teamId,userId,token]); // run this effect when teamId, userId or token changes

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
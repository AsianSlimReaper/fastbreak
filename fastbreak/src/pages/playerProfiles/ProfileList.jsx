import React, {useEffect, useState} from "react";
import "./ProfileList.css";
import {useParams} from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import {getTeamProfileCards} from "../../services/playerProfile.js";
import PlayerCard from "../../components/player_profile/playerCard.jsx";
import Loader from "../../components/universal/Loader.jsx";

function ProfileList(){
    // Retrieve the access token from localStorage
    const token = localStorage.getItem("access_token");
    const { teamId } = useParams();

    // Initialize state for teams and profile cards
    const [teams, setTeams] = useState([]);
    const [profileCards, setProfileCards] = useState([]);

    // Load teams from localStorage when the component mounts or when teamId changes
    useEffect(() => {
        // Retrieve teams from localStorage
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        // If teams are stored and teamId is available, set the teams state
        if (storedTeams && teamId) {
            setTeams(storedTeams);
            }
    }, [teamId]); // run when teamId changes

    // Fetch player profile cards when the component mounts or when token or teamId changes
    useEffect(() => {
        const fetchPlayerCards = async() =>{
            try{
                // Call the service to get player profile cards for the specified team
                const profileCardsData = await getTeamProfileCards(teamId, token);
                // Set the fetched profile cards in the state
                setProfileCards(profileCardsData)
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("Error fetching player cards:", error);
            }
        }
        if (teamId && token) {
            // Call the function to fetch player cards
            fetchPlayerCards();
        }
    }, [token,teamId]); // run when token or teamId changes

    return(
        <>
            {profileCards?(
            <MainLayout teams={teams}>
                <PlayerCard profileCards={profileCards}/>
            </MainLayout>):(
                <div className='player-profile-loader'>
                    <Loader/>
                </div>
            )
            }
        </>
    )
}

export default ProfileList
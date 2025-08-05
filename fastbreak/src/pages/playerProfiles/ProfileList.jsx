import React, {useEffect, useState} from "react";
import "./ProfileList.css";
import {useParams} from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import {getTeamProfileCards} from "../../services/playerProfile.js";
import PlayerCard from "../../components/player_profile/playerCard.jsx";
import Loader from "../../components/universal/Loader.jsx";

function ProfileList(){
    const token = localStorage.getItem("access_token");
    const { teamId } = useParams();

    const [teams, setTeams] = useState([]);
    const [profileCards, setProfileCards] = useState([]);

    useEffect(() => {
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        if (storedTeams && teamId) {
            setTeams(storedTeams);
            }
    }, [teamId]);

    useEffect(() => {
        const fetchPlayerCards = async() =>{
            try{
                const profileCardsData = await getTeamProfileCards(teamId, token);
                setProfileCards(profileCardsData)
            } catch (error) {
                console.error("Error fetching player cards:", error);
            }
        }
        if (teamId && token) {
            fetchPlayerCards();
        }
    }, [token,teamId]);

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
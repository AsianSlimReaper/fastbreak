import React from "react";
import "./playerCard.css";
import PlayerAvatar from "../universal/PlayerAvatar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import ButtonComponent from "../universal/ButtonComponent.jsx";

function PlayerCard({ profileCards }) {
    // initialize navigate and params
    const navigate = useNavigate();
    const { teamId: currentTeamId } = useParams(); // get the current team ID from the URL parameters

    // Function to handle card click and navigate to player profile
    const handleCardClick = (userId) => {
        // Navigate to the player profile page with the current team ID and user ID
        navigate(`/player-profile/player/${currentTeamId}/${userId}`);
    };

    return (
        <div className='player-card-list'>
            {profileCards.map((card) => (
                <div className='player-card-container' key={card.user_id}>
                    <div className='player-avatar-wrapper'>
                        <PlayerAvatar name={card.user_name}/>
                    </div>
                    <h3>{card.user_name}</h3>
                    <p>#{card.jersey_number ?? "-"}</p>
                    <p>{card.position ?? "N/A"}</p>
                    <ButtonComponent
                        onClick={() => handleCardClick(card.user_id)}
                        className='view-profile-button'
                    >
                        View Profile
                    </ButtonComponent>
                </div>
            ))}
        </div>
    );
}

export default PlayerCard;

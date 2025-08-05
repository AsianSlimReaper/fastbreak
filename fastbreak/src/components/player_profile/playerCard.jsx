import React from "react";
import "./playerCard.css";
import PlayerAvatar from "../universal/PlayerAvatar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import ButtonComponent from "../universal/ButtonComponent.jsx";

function PlayerCard({ profileCards }) {
    const navigate = useNavigate();
    const { teamId: currentTeamId } = useParams();

    const handleCardClick = (userId) => {
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

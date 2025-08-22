import React from "react";
import PlayerAvatar from "../universal/PlayerAvatar.jsx";
import './PlayerIndividualStats.css'

//input: IndividualStats: object containing individual stats of the player
//output: individual stats of the player in a card format
function DashboardPlayerIndividualStats({IndividualStats,user_name}) {
    //intializing the individual stats
    const ppg = IndividualStats.ppg;
    const apg = IndividualStats.apg;
    const rpg = IndividualStats.rpg;
    const spg = IndividualStats.spg ;
    const bpg = IndividualStats.bpg;

    return(
        <>
        <div className='dashboard-player-individual-stats-container'>
            <div className='dashboard-player-individual-stats-header'>
                <div className='dashboard-player-individual-stats-avatar'>
                    <PlayerAvatar name={user_name}/>
                </div>
                <h2>{user_name}</h2>
            </div>
            <div className='dashboard-player-individual-stats'>
                <div className='stats-row'>
                    <div className='stat-item'><span className='stat-label'>PPG:</span>
                        <span className='stat-value'>{ppg.toFixed(1)}</span>
                    </div>
                    <div className='stat-item'>
                        <span className='stat-label'>APG:</span>
                        <span className='stat-value'>{apg.toFixed(1)}</span>
                    </div>
                    <div className='stat-item'>
                        <span className='stat-label'>RPG:</span>
                        <span className='stat-value'>{rpg.toFixed(1)}</span>
                    </div>
                </div>
                <div className='stats-row staggered'>
                    <div className='stat-item'>
                        <span className='stat-label'>SPG:</span>
                        <span className='stat-value'>{spg.toFixed(1)}</span>
                    </div>
                    <div className='stat-item'>
                        <span className='stat-label'>BPG:</span>
                        <span className='stat-value'>{bpg.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
</>
)
}

export default DashboardPlayerIndividualStats
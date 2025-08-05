import React from "react";
import PlayerAvatar from "../universal/PlayerAvatar.jsx";
import './PlayerIndividualStats.css'

function DashboardPlayerIndividualStats({DashboardData,user_name}) {
    const ppg = DashboardData?.individual_stats?.ppg || 0;
    const apg = DashboardData?.individual_stats?.apg || 0;
    const rpg = DashboardData?.individual_stats?.rpg || 0;
    const spg = DashboardData?.individual_stats?.spg || 0;
    const bpg = DashboardData?.individual_stats?.bpg || 0;

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
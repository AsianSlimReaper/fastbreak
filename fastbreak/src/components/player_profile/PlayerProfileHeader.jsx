import React from "react";
import "./PlayerProfileHeader.css"
import PlayerAvatar from "../universal/PlayerAvatar.jsx";

function PlayerProfileHeader({player, team, stats }){

    return(
        <>
            <div className='player-profile-header'>
                <div className='player-profile-player-info'>
                    <div className='player-profile-header-avatar'>
                        <PlayerAvatar name={player.user_name}/>
                    </div>
                    <div className='player-profile-header-summary'>
                        <span className='player-profile-jersey-number'>#{player.jersey_number}  </span>
                        <span className='player-profile-player-name'>{player.user_name}</span>
                        <p>{team.team_name}</p>
                        <p>{player.position}</p>
                    </div>
                </div>
                <div className='player-profile-header-stats'>
                    <p>{stats.ppg}ppg</p>
                    <p>{stats.apg}apg</p>
                    <p>{stats.rpg}rpg</p>
                    <p>{stats.spg}spg</p>
                    <p>{stats.bpg}bpg</p>
                </div>
            </div>
        </>
    )
}

export default PlayerProfileHeader
import React from "react";
import "./PlayerProfileBody.css"

function PlayerProfileBody({stats,recentGames}){
    return(
        <div className='player-profile-body'>
            <div className='player-profile-body-stats-grid'>
                <div className='player-profile-body-stat'>
                    <h4>Mins</h4>
                    <p>{stats.mins}</p>
                </div>
                <div className='player-profile-body-stat'>
                    <h4>FG%</h4>
                    <p>{stats.fg_pct}</p>
                </div>
                <div className='player-profile-body-stat'>
                    <h4>3P%</h4>
                    <p>{stats.threep_pct}</p>
                </div>
                <div className='player-profile-body-stat'>
                    <h4>FT%</h4>
                    <p>{stats.ft_pct}</p>
                </div>
                <div className='player-profile-body-stat'>
                    <h4>EFG%</h4>
                    <p>{stats.efg_pct}</p>
                </div>
                <div className='player-profile-body-stat'>
                    <h4>TS%</h4>
                    <p>{stats.ts_pct}</p>
                </div>
                <div className='player-profile-body-stat'>
                    <h4>+-</h4>
                    <p>{stats.plus_minus}</p>
                </div>
                <div className='player-profile-body-stat'>
                    <h4>TOV</h4>
                    <p>{stats.tov}</p>
                </div>
            </div>

            <div className='player-profile-recent-games-container'>
                <h3>Recent Games</h3>
                <table className="player-profile-recent-games-table">
				    <thead>
				        <tr>
					        <th>Date</th>
					            <th>Opponent</th>
					            <th>Score</th>
					        <th>Results</th>
				        </tr>
                    </thead>
				    <tbody>
				        {recentGames.length === 0 ? (
					        <tr>
						        <td colSpan="4" style={{ textAlign: "center" }}>
							        No recent games available.
                                </td>
                            </tr>
                        ) : (
                            recentGames.map((game) => (
                                <tr key={game.id}>
                                    <td>{new Date(game.date).toLocaleDateString()}</td>
                                    <td>{game.opponent}</td>
                                    <td>{game.team_score}-{game.opponent_score}</td>
                                    <td style={{ color: game.result === "Win" ? "green" : game.result === "Loss" ? "red" : "gray" }}>
                                        {game.result}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PlayerProfileBody
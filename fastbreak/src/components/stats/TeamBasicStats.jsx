import React from "react";
import './TeamBasicStats.css'

function TeamBasicStats({ stats }) {
    return(
        <div className='team-basic-stats-table'>
            <h2>Team</h2>
            <table>
                <thead>
                    <tr>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Draws</th>
                        <th>PTS</th>
                        <th>AST</th>
                        <th>REB</th>
                        <th>STL</th>
                        <th>BLK</th>
                        <th>TOV</th>
                        <th>FLS</th>
                        <th>OffRTG</th>
                        <th>DefRTG</th>
                        <th>NetRTG</th>
                        <th>Pace</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{stats.wins}</td>
                        <td>{stats.losses}</td>
                        <td>{stats.draws}</td>
                        <td>{stats.points_for}</td>
                        <td>{stats.ast}</td>
                        <td>{stats.reb}</td>
                        <td>{stats.stl}</td>
                        <td>{stats.blk}</td>
                        <td>{stats.tov}</td>
                        <td>{stats.fls}</td>
                        <td>{stats.off_rtg}</td>
                        <td>{stats.def_rtg}</td>
                        <td>{stats.net_rtg}</td>
                        <td>{stats.pace}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TeamBasicStats
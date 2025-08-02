import React from "react";
import "./TeamShootingStats.css"

function TeamShootingStats({stats}){
    return(
        <div className='team-shooting-stats-table'>
            <h2>Team</h2>
            <table>
                <thead>
                    <tr>
                        <th>FGM</th>
                        <th>FGA</th>
                        <th>FG%</th>
                        <th>2PM</th>
                        <th>2PA</th>
                        <th>2P%</th>
                        <th>3PM</th>
                        <th>3PA</th>
                        <th>3P%</th>
                        <th>FTM</th>
                        <th>FTA</th>
                        <th>FT%</th>
                        <th>eFG%</th>
                        <th>TS%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{stats.fgm}</td>
                        <td>{stats.fga}</td>
                        <td>{stats.fg_pct}%</td>
                        <td>{stats.twopm}</td>
                        <td>{stats.twopa}</td>
                        <td>{stats.twop_pct}%</td>
                        <td>{stats.threepm}</td>
                        <td>{stats.threepa}</td>
                        <td>{stats.threep_pct}%</td>
                        <td>{stats.ftm}</td>
                        <td>{stats.fta}</td>
                        <td>{stats.ft_pct}%</td>
                        <td>{stats.efg_pct}%</td>
                        <td>{stats.ts_pct}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TeamShootingStats;
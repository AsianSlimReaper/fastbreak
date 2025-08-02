import React from "react";
import './IndividualShootingStats.css'

function IndividualShootingStats({stats}){
    return(
        <div className='individual-shooting-stats-table'>
            <h2>Individual</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
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
                {stats.length===0?(
                    <tr>
                        <td colSpan="15" style={{textAlign:"center"}}>
                            No individual player shooting stats available.
                        </td>
                    </tr>
                ):(
                    stats.map((player) =>(
                        <tr key={player.user_id}>
                            <td>{player.user_name}</td>
                            <td>{player.fgm}</td>
                            <td>{player.fga}</td>
                            <td>{player.fg_pct}%</td>
                            <td>{player.twopm}</td>
                            <td>{player.twopa}</td>
                            <td>{player.twop_pct}%</td>
                            <td>{player.threepm}</td>
                            <td>{player.threepa}</td>
                            <td>{player.threep_pct}%</td>
                            <td>{player.ftm}</td>
                            <td>{player.fta}</td>
                            <td>{player.ft_pct}%</td>
                            <td>{player.efg_pct}%</td>
                            <td>{player.ts_pct}%</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    )
}

export default IndividualShootingStats
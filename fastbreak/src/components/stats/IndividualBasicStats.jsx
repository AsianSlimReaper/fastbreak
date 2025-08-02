import React from "react";
import'./IndividualBasicStats.css';

function IndividualBasicStats({ stats}){
    return(
        <div className='individual-basic-stats-table'>
            <h2>Individual</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Games Played</th>
                        <th>Mins</th>
                        <th>PTS</th>
                        <th>AST</th>
                        <th>REB</th>
                        <th>STL</th>
                        <th>BLK</th>
                        <th>TOV</th>
                        <th>FLS</th>
                        <th>+-</th>
                        <th>Eff</th>
                    </tr>
                </thead>
                <tbody>
                {stats.length===0?(
                    <tr>
                        <td colSpan="13" style={{textAlign:"center"}}>
                            No individual player stats available.
                        </td>
                    </tr>
                ):(
                    stats.map((player) =>(
                        <tr key={player.user_id}>
                            <td>{player.user_name}</td>
                            <td>{player.games_played}</td>
                            <td>{player.mins}</td>
                            <td>{player.ppg}</td>
                            <td>{player.asg}</td>
                            <td>{player.rpg}</td>
                            <td>{player.spg}</td>
                            <td>{player.bpg}</td>
                            <td>{player.tpg}</td>
                            <td>{player.fpg}</td>
                            <td>{player.plus_minus}</td>
                            <td>{player.efficiency}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    )
}

export default IndividualBasicStats;
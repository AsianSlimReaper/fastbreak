import React from 'react'
import './BasicStatTable.css'
import ButtonComponent from "../universal/ButtonComponent.jsx";

function BasicStatsTable({teamStats, opponentStats, subs}){
	return(
		<>
			<h2>Team</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Mins</th>
						<th>PTS</th>
						<th>AST</th>
						<th>REB</th>
						<th>OREB</th>
						<th>DREB</th>
						<th>STL</th>
						<th>BLK</th>
						<th>TOV</th>
						<th>FLS</th>
						<th>+-</th>
						<th>EFF</th>
					</tr>
				</thead>
				<tbody>
				{teamStats.map((player)=>(
					<tr key={player.user_id}>
						<td>{player.name}</td>
						<td>{player.mins}</td>
						<td>{player.pts}</td>
						<td>{player.ast}</td>
						<td>{player.reb}</td>
						<td>{player.oreb}</td>
						<td>{player.dreb}</td>
						<td>{player.stl}</td>
						<td>{player.blk}</td>
						<td>{player.tov}</td>
						<td>{player.fls}</td>
						<td>{player.plus_minus}</td>
						<td>{player.eff}</td>
					</tr>
				))}
				<tr>
					<td colSpan='13' style={{textAlign:'center'}}>
						<ButtonComponent>Add Player</ButtonComponent>
					</td>
				</tr>
				</tbody>
			</table>

			<h2>Opponent</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Mins</th>
						<th>PTS</th>
						<th>AST</th>
						<th>REB</th>
						<th>OREB</th>
						<th>DREB</th>
						<th>STL</th>
						<th>BLK</th>
						<th>TOV</th>
						<th>FLS</th>
						<th>+-</th>
						<th>EFF</th>
					</tr>
				</thead>
				<tbody>
				{opponentStats.map((opponent)=>(
					<tr key={opponent.name}>
						<td>{opponent.name}</td>
						<td>{opponent.mins}</td>
						<td>{opponent.pts}</td>
						<td>{opponent.ast}</td>
						<td>{opponent.reb}</td>
						<td>{opponent.oreb}</td>
						<td>{opponent.dreb}</td>
						<td>{opponent.stl}</td>
						<td>{opponent.blk}</td>
						<td>{opponent.tov}</td>
						<td>{opponent.fls}</td>
						<td>{opponent.plus_minus}</td>
						<td>{opponent.eff}</td>
					</tr>
				))}
				</tbody>
			</table>
		</>
	)
}

export default BasicStatsTable
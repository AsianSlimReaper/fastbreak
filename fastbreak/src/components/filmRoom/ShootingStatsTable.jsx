import React from "react";
import './ShootingStatsTable.css'

function ShootingStatsTable({teamStats, opponentStats}){
	return(
		<>
			<h2>Team</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>FGA</th>
						<th>FGM</th>
						<th>FG%</th>
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
				{teamStats.map((player)=>(
					<tr key={player.user_id}>
						<td>{player.name}</td>
						<td>{player.fgm}</td>
						<td>{player.fga}</td>
						<td>{player.fg_pct}</td>
						<td>{player.threepm}</td>
						<td>{player.threepa}</td>
						<td>{player.threep_pct}</td>
						<td>{player.ftm}</td>
						<td>{player.fta}</td>
						<td>{player.ft_pct}</td>
						<td>{player.efg_pct}</td>
						<td>{player.ts_pct}</td>
					</tr>
				))}
				</tbody>
			</table>

			<h2>Opponent</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>FGA</th>
						<th>FGM</th>
						<th>FG%</th>
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
				{opponentStats.map((opponent)=>(
					<tr key={opponent.name}>
						<td>{opponent.name}</td>
						<td>{opponent.fgm}</td>
						<td>{opponent.fga}</td>
						<td>{opponent.fg_pct}</td>
						<td>{opponent.threepm}</td>
						<td>{opponent.threepa}</td>
						<td>{opponent.threep_pct}</td>
						<td>{opponent.ftm}</td>
						<td>{opponent.fta}</td>
						<td>{opponent.ft_pct}</td>
						<td>{opponent.efg_pct}</td>
						<td>{opponent.ts_pct}</td>
					</tr>
				))}
				</tbody>
			</table>
		</>
	)
}

export default ShootingStatsTable
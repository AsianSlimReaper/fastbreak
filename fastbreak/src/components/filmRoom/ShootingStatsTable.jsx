import React from "react";
import './ShootingStatsTable.css'

function calculateShootingPercentage(made, attempted) {
	if (!attempted || attempted === 0) return 0;
	return ((made || 0) / attempted * 100).toFixed(1);
}

function calculateEFG(fgm, threepm, fga) {
    if (!fga || fga === 0) return 0;
    return (((fgm || 0) + 0.5 * (threepm || 0)) / fga * 100).toFixed(1);
}

function calculatePTS(fgm,threepm,ftm){
	return ((fgm-threepm || 0)*2 + (threepm || 0) * 3+ (ftm || 0)).toFixed(1);
}

function calculateTS(pts, fga, fta) {
    const denom = (2 * (fga || 0) + 0.44 * (fta || 0));
    if (!denom || denom === 0) return 0;
    return ((pts || 0) / denom * 100).toFixed(1);
}


function ShootingStatsTable({teamStats, opponentStats, participants = [], starters = [], bench = []}){
	// Helper to get player stats by user_id
	const getPlayerStats = (user_id) => teamStats.find(p => String(p.user_id) === String(user_id));

	const onCourtPlayers = participants.filter(p => starters.map(String).includes(String(p.user_id)));
	const benchPlayers = participants.filter(p => bench.map(String).includes(String(p.user_id)));

	return(
		<>
			<h2>On Court</h2>
			<table className="styled-table">
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
				{onCourtPlayers.map((player) => {
					const stats = getPlayerStats(player.user_id) || {};
					const efg = calculateEFG(stats.fgm, stats.threepm, stats.fga);
					const pts = calculatePTS(stats.fgm, stats.threepm, stats.ftm);
					const ts = calculateTS(pts, stats.fga, stats.fta);
					const fg_pct = calculateShootingPercentage(stats.fgm, stats.fga);
					const threep_pct = calculateShootingPercentage(stats.threepm, stats.threepa);
					const ft_pct = calculateShootingPercentage(stats.ftm, stats.fta);
					return (
						<tr key={player.user_id}>
							<td>{player.name}</td>
							<td>{stats.fga ?? ""}</td>
							<td>{stats.fgm ?? ""}</td>
							<td>{fg_pct}</td>
							<td>{stats.threepm ?? ""}</td>
							<td>{stats.threepa ?? ""}</td>
							<td>{threep_pct}</td>
							<td>{stats.ftm ?? ""}</td>
							<td>{stats.fta ?? ""}</td>
							<td>{ft_pct}</td>
							<td>{efg}</td>
							<td>{ts}</td>
						</tr>
					);
				})}
				</tbody>
			</table>

			<h2>Bench</h2>
			<table className="styled-table">
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
				{benchPlayers.map((player) => {
					const stats = getPlayerStats(player.user_id) || {};
					const efg = calculateEFG(stats.fgm, stats.threepm, stats.fga);
					const pts = calculatePTS(stats.fgm, stats.threepm, stats.ftm);
					const ts = calculateTS(pts, stats.fga, stats.fta);
					const fg_pct = calculateShootingPercentage(stats.fgm, stats.fga);
					const threep_pct = calculateShootingPercentage(stats.threepm, stats.threepa);
					const ft_pct = calculateShootingPercentage(stats.ftm, stats.fta);
					return (
						<tr key={player.user_id}>
							<td>{player.name}</td>
							<td>{stats.fga ?? ""}</td>
							<td>{stats.fgm ?? ""}</td>
							<td>{fg_pct}</td>
							<td>{stats.threepm ?? ""}</td>
							<td>{stats.threepa ?? ""}</td>
							<td>{threep_pct}</td>
							<td>{stats.ftm ?? ""}</td>
							<td>{stats.fta ?? ""}</td>
							<td>{ft_pct}</td>
							<td>{efg}</td>
							<td>{ts}</td>
						</tr>
					);
				})}
				</tbody>
			</table>

			<h2>Opponent</h2>
			<table className="styled-table">
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
						<td>{opponent.fga}</td>
						<td>{opponent.fgm}</td>
						<td>{calculateShootingPercentage(opponent.fgm,opponent.fga)}</td>
						<td>{opponent.threepm}</td>
						<td>{opponent.threepa}</td>
						<td>{calculateShootingPercentage(opponent.threepm,opponent.threepa)}</td>
						<td>{opponent.ftm}</td>
						<td>{opponent.fta}</td>
						<td>{calculateShootingPercentage(opponent.ftm,opponent.fta)}</td>
						<td>{calculateEFG(opponent.fgm, opponent.threepm, opponent.fga)}</td>
						<td>{calculateTS(opponent.pts, opponent.fga, opponent.fta)}</td>
					</tr>
				))}
				</tbody>
			</table>
		</>
	)
}

export default ShootingStatsTable
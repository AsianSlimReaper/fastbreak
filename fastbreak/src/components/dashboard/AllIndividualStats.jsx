import React from "react";
import "./AllIndividualStats.css";

//input: IndividualStats - an array of objects containing individual player stats
//output: a table displaying individual player stats with columns for Name, PPG, APG, RPG, SPG, and BPG
function DashboardAllIndividualStats({ IndividualStats }) {
	//check if IndividualStats is an array, if not, set it to an empty array
	const players = Array.isArray(IndividualStats)
		? IndividualStats
		: [];

	return (
		<div className="dashboard-all-individual-stats-container">
			<h3>Individual Player Stats</h3>
			<table className="player-stats-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>PPG</th>
						<th>APG</th>
						<th>RPG</th>
						<th>SPG</th>
						<th>BPG</th>
					</tr>
				</thead>
				<tbody>
					{players.length === 0 ? (
						<tr>
							<td colSpan="7" style={{ textAlign: "center" }}>
								No individual player stats available.
							</td>
						</tr>
					) : (
						players.map((player) => (
							<tr key={player.name}>
								<td>{player.name}</td>
								<td>{player.ppg.toFixed(1)}</td>
								<td>{player.apg.toFixed(1)}</td>
								<td>{player.rpg.toFixed(1)}</td>
								<td>{player.spg.toFixed(1)}</td>
								<td>{player.bpg.toFixed(1)}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

export default DashboardAllIndividualStats

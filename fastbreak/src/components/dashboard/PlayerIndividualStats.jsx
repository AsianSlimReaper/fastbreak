import React from "react";
import './PlayerIndividualStats.css'

function DashboardPlayerIndividualStats({DashboardData}) {
	const ppg = DashboardData?.individual_stats?.ppg || 0;
	const apg = DashboardData?.individual_stats?.apg || 0;
	const rpg = DashboardData?.individual_stats?.rpg || 0;
	const spg = DashboardData?.individual_stats?.spg || 0;
	const bpg = DashboardData?.individual_stats?.bpg || 0;

	return(
		<>
			<div className='dashboard-individual-player-stats-grid'>
				<div className='dashboard-individual-player-stats-item'>
					<h3>Points Per Game (PPG)</h3>
					<p>{ppg.toFixed(2)}</p>
				</div>
				<div className='dashboard-individual-player-stats-item'>
					<h3>Assists Per Game (APG)</h3>
					<p>{apg.toFixed(2)}</p>
				</div>
				<div className='dashboard-individual-player-stats-item'>
					<h3>Rebounds Per Game (RPG)</h3>
					<p>{rpg.toFixed(2)}</p>
				</div>
				<div className='dashboard-individual-player-stats-item'>
					<h3>Steals Per Game (SPG)</h3>
					<p>{spg.toFixed(2)}</p>
				</div>
				<div className='dashboard-individual-player-stats-item'
					style={{ gridColumn: "1 / 3" }}>
					<h3>Blocks Per Game (BPG)</h3>
					<p>{bpg.toFixed(2)}</p>
				</div>
			</div>
		</>
	)
}

export default DashboardPlayerIndividualStats
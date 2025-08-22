import React from "react";
import './TeamStats.css'


//input: teamStats object containing wins, losses, draws, offensive rating, defensive rating, and net rating
//output: a grid of stats displaying the team's season record, offensive rating, defensive rating, and net rating
function DashboardTeamStats({  teamStats }) {
	//load data into variables
	const wins = teamStats.wins;
	const losses = teamStats.losses;
	const draws = teamStats.draws;
	const record = `${wins}-${losses}-${draws}`;

	const offRtg = teamStats.off_rtg;
	const defRtg = teamStats.def_rtg;
	const netRtg = teamStats.net_rtg;

	//define styles for net rating based on its value
	const netRtgStyle = {
		color: netRtg > 0 ? "#18FF0A" : netRtg < 0 ? "#F70808" : "#8A8A8A"
	};

	return (
		<div className="dashboard-team-stats-grid">
			<div className="stat-box">
				<h4>Season Record</h4>
				<p><strong>Record:</strong> {record}</p>
			</div>

			<div className="stat-box">
				<h4>Offensive Rating</h4>
				<p>{offRtg.toFixed(1)}</p>
			</div>

			<div className="stat-box">
				<h4>Defensive Rating</h4>
				<p>{defRtg.toFixed(1)}</p>
			</div>

			<div className="stat-box">
				<h4>Net Rating</h4>
				<p style={netRtgStyle}>{netRtg.toFixed(1)}</p>
			</div>
		</div>
	);
}

export default DashboardTeamStats;

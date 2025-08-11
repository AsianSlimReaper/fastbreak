import React from "react";
import './TeamStats.css'
import Loader from "../universal/Loader.jsx";

function DashboardTeamStats({  teamStats }) {
	const wins = teamStats.wins;
	const losses = teamStats.losses;
	const draws = teamStats.draws;
	const record = `${wins}-${losses}-${draws}`;

	const offRtg = teamStats.off_rtg;
	const defRtg = teamStats.def_rtg;
	const netRtg = teamStats.net_rtg;

	const netRtgStyle = {
		color: netRtg > 0 ? "#18FF0A" : netRtg < 0 ? "#18FF0A" : "#8A8A8A"
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

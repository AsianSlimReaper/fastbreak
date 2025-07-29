import React from "react";
import './TeamStats.css'

function DashboardTeamStats({ DashboardData }) {
	const wins = DashboardData?.wins || 0;
	const losses = DashboardData?.losses || 0;
	const draws = DashboardData?.draws || 0;
	const record = `${wins}-${losses}-${draws}`;

	const offRtg = DashboardData?.off_rtg ?? 0;
	const defRtg = DashboardData?.def_rtg ?? 0;
	const netRtg = DashboardData?.net_rtg ?? 0;

	const netRtgStyle = {
		color: netRtg > 0 ? "green" : netRtg < 0 ? "red" : "#A1A1AA"
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

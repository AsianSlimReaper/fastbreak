import React from "react";
import './DashboardRecentGames.css'

function DashboardRecentGames({dashboardData}){
	const recentGames = dashboardData?.recent_games || [];

	return(
		<div className="dashboard-recent-games-container">
			<h3>Recent Games</h3>
			<table className="dashboard-recent-games-table">
				<thead>
				<tr>
					<th>Date</th>
					<th>Opponent</th>
					<th>Score</th>
					<th>Results</th>
				</tr>
				</thead>
				<tbody>
				{recentGames.length === 0 ? (
					<tr>
						<td colSpan="4" style={{ textAlign: "center" }}>
							No recent games available.
						</td>
					</tr>
				) : (
					recentGames.map((game) => (
						<tr key={game.id}>
							<td>{new Date(game.date).toLocaleDateString()}</td>
							<td>{game.opponent}</td>
							<td>{game.team_score}-{game.opponent_score}</td>
							<td style={{ color: game.result === "win" ? "#18FF0A" : game.result === "loss" ? "#F70808" : "#8A8A8A" }}>
								{game.result}
							</td>
						</tr>
					))
				)}
				</tbody>
			</table>
		</div>
	)
}

export default DashboardRecentGames
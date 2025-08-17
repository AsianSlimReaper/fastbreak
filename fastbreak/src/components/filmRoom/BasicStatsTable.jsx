import React, { useState } from 'react'
import './BasicStatTable.css'
import ButtonComponent from "../universal/ButtonComponent.jsx";

function BasicStatsTable({
	teamStats, opponentStats, subs,
	participants = [], starters = [], bench = [],
	onAddPlayer, allPlayers = [],
	selectedPlayerId,
	onPlayerRowClick
}) {
	// Helper to get player stats by user_id
	const getPlayerStats = (user_id) => teamStats.find(p => String(p.user_id) === String(user_id));

	// On Court and Bench player objects
	const onCourtPlayers = participants.filter(p => starters.map(String).includes(String(p.user_id)));
	const benchPlayers = participants.filter(p => bench.map(String).includes(String(p.user_id)));

	const [showAdd, setShowAdd] = useState(false);
	const [selectedIds, setSelectedIds] = useState([]);

	const handleCheckboxChange = (user_id) => {
		setSelectedIds(prev =>
			prev.includes(user_id)
				? prev.filter(id => id !== user_id)
				: [...prev, user_id]
		);
	};

	const handleAddSelectedPlayers = () => {
		const toAdd = allPlayers.filter(
			p => selectedIds.includes(String(p.user_id)) &&
				!participants.some(existing => String(existing.user_id) === String(p.user_id))
		);
		toAdd.forEach(player => onAddPlayer(player));
		setSelectedIds([]);
		setShowAdd(false);
	};

	return (
		<>
			<h2>On Court</h2>
			<table className="styled-table">
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
					{onCourtPlayers.map((player) => {
						const stats = getPlayerStats(player.user_id) || {};
						const isSelected = String(selectedPlayerId) === String(player.user_id);
						return (
							<tr
								key={player.user_id}
								className={isSelected ? "selected-player-row" : ""}
								onClick={() => onPlayerRowClick && onPlayerRowClick(player.user_id)}
								style={{ cursor: "pointer", userSelect: "none" }}
								tabIndex={0}
								onKeyDown={e => {
									if (e.key === "Enter" || e.key === " ") {
										onPlayerRowClick && onPlayerRowClick(player.user_id);
									}
								}}
							>
								<td>{player.name}</td>
								<td>{stats.mins ?? ""}</td>
								<td>{stats.pts ?? ""}</td>
								<td>{stats.ast ?? ""}</td>
								<td>{stats.reb ?? ""}</td>
								<td>{stats.oreb ?? ""}</td>
								<td>{stats.dreb ?? ""}</td>
								<td>{stats.stl ?? ""}</td>
								<td>{stats.blk ?? ""}</td>
								<td>{stats.tov ?? ""}</td>
								<td>{stats.fls ?? ""}</td>
								<td>{stats.plus_minus ?? ""}</td>
								<td>{stats.eff ?? ""}</td>
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
					{benchPlayers.map((player) => {
						const stats = getPlayerStats(player.user_id) || {};
						const isSelected = String(selectedPlayerId) === String(player.user_id);
						return (
							<tr
								key={player.user_id}
								className={isSelected ? "selected-player-row" : ""}
								onClick={() => onPlayerRowClick && onPlayerRowClick(player.user_id)}
								style={{ cursor: "pointer", userSelect: "none" }}
								tabIndex={0}
								onKeyDown={e => {
									if (e.key === "Enter" || e.key === " ") {
										onPlayerRowClick && onPlayerRowClick(player.user_id);
									}
								}}
							>
								<td>{player.name}</td>
								<td>{stats.mins ?? ""}</td>
								<td>{stats.pts ?? ""}</td>
								<td>{stats.ast ?? ""}</td>
								<td>{stats.reb ?? ""}</td>
								<td>{stats.oreb ?? ""}</td>
								<td>{stats.dreb ?? ""}</td>
								<td>{stats.stl ?? ""}</td>
								<td>{stats.blk ?? ""}</td>
								<td>{stats.tov ?? ""}</td>
								<td>{stats.fls ?? ""}</td>
								<td>{stats.plus_minus ?? ""}</td>
								<td>{stats.eff ?? ""}</td>
							</tr>
						);
					})}
					<tr>
						<td colSpan='13' style={{textAlign:'center'}}>
							<ButtonComponent onClick={() => setShowAdd(true)}>Add Player</ButtonComponent>
							{showAdd && (
								<div className="modal-backdrop">
									<div className="modal">
										<h3>Select Players to Add</h3>
										<div className="modal-player-list">
											{allPlayers.length === 0 && <div>No players available.</div>}
											{allPlayers.map(player => (
												<div key={player.user_id} className="modal-player-row">
													<input
														type="checkbox"
														checked={selectedIds.includes(String(player.user_id))}
														onChange={() => handleCheckboxChange(String(player.user_id))}
														disabled={participants.some(existing => String(existing.user_id) === String(player.user_id))}
													/>
													<span>{player.name}</span>
												</div>
											))}
										</div>
										<div className="modal-actions">
											<ButtonComponent onClick={handleAddSelectedPlayers} disabled={selectedIds.length === 0}>Add Selected</ButtonComponent>
											<ButtonComponent onClick={() => { setShowAdd(false); setSelectedIds([]); }}>Cancel</ButtonComponent>
										</div>
									</div>
								</div>
							)}
						</td>
					</tr>
				</tbody>
			</table>

			<h2>Opponent</h2>
			<table className="styled-table">
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
					{opponentStats.map((opponent) => (
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
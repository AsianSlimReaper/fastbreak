import React from "react";
import TabComponent from "../universal/TabComponent.jsx";
import "./EditTabContainer.css"
import BasicStatsTable from "./BasicStatsTable.jsx";
import ShootingStatsTable from "./ShootingStatsTable.jsx";
import AnalysisTable from "./AnalysisTable.jsx";

function EditTabContainer({
	teamBasicStats, opponentBasicStats,
	teamShootingStats, opponentShootingStats,
	comments, subs,
	participants, starters, bench,
	onAddPlayer,
	allPlayers = [],
	onSeekVideo,
	activeTab,
	setActiveTab,
	selectedPlayerId,
	onPlayerRowClick
}) {
	// Define the tabs with their labels and content
	const tabs = [
		{ label: "Basic Stats", content: <BasicStatsTable
				teamStats={teamBasicStats}
				opponentStats={opponentBasicStats}
				subs={subs}
				participants={participants}
				starters={starters}
				bench={bench}
				onAddPlayer={onAddPlayer}
				allPlayers={allPlayers}
				selectedPlayerId={selectedPlayerId}
				onPlayerRowClick={onPlayerRowClick}
			/> },
    	{ label: "Shooting Stats", content: <ShootingStatsTable
				teamStats={teamShootingStats}
				opponentStats={opponentShootingStats}
				participants={participants}
				starters={starters}
				bench={bench}
			/> },
    	{ label: "Analysis", content: <AnalysisTable comments={comments?.comments || []} onCommentClick={onSeekVideo} /> },
  	];
	return(
		<div className="edit-tab-container">
			<TabComponent
				tabs={tabs}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
		</div>
	)
}

export default EditTabContainer
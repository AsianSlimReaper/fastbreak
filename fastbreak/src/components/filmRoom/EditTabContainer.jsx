import React from "react";
import TabComponent from "../universal/TabComponent.jsx";
import "./EditTabContainer.css"
import BasicStatsTable from "./BasicStatsTable.jsx";
import ShootingStatsTable from "./ShootingStatsTable.jsx";

function EditTabContainer({
							  teamBasicStats, opponentBasicStats,
							  teamShootingStats, opponentShootingStats,
							  comments,subs
						  }){
	const tabs = [
		{ label: "Basic Stats", content: <BasicStatsTable
				teamStats={teamBasicStats}
				opponentStats={opponentBasicStats}
				subs={subs}/> },
    	{ label: "Shooting Stats", content: <ShootingStatsTable
				teamStats={teamShootingStats}
				opponentStats={opponentShootingStats}/> },
    	{ label: "Analysis", content: <div>analysis</div> },
  	];
	return(
		<TabComponent tabs={tabs}/>
	)
}

export default EditTabContainer
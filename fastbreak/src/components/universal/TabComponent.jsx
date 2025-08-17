import React, { useState } from "react";
import "./TabComponent.css"

function TabComponent({ tabs, activeTab, setActiveTab }) {
	const [internalActiveTab, internalSetActiveTab] = useState(0);

	const currentActiveTab = activeTab !== undefined ? activeTab : internalActiveTab;
	const currentSetActiveTab = setActiveTab || internalSetActiveTab;

	return (
		<div className="tab-container">
			<div className="tab-header">
				{tabs.map((tab, index) => (
					<button
						key={index}
						className={`tab-button ${currentActiveTab === index ? "active" : ""}`}
						onClick={() => currentSetActiveTab(index)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="tab-content">
				{tabs[currentActiveTab]?.content}
			</div>
		</div>
	);
}

export default TabComponent;

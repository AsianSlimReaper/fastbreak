import React, { useState } from "react";
import "./TabComponent.css"

function TabComponent({ tabs, activeTab, setActiveTab }) {
	// initialize internal state for active tab if not provided
	const [internalActiveTab, internalSetActiveTab] = useState(0);

	// Determine which active tab to use: provided prop or internal state
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

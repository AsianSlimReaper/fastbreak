import React, { useState } from "react";
import "./TabComponent.css"

function Tabs({ tabs }) {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<div className="tab-container">
			<div className="tab-header">
				{tabs.map((tab, index) => (
					<button
						key={index}
						className={`tab-button ${activeTab === index ? "active" : ""}`}
						onClick={() => setActiveTab(index)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="tab-content">
				{tabs[activeTab] && tabs[activeTab].content}
			</div>
		</div>
	);
}

export default Tabs;

import React from "react";
import MainNav from "../main/MainNav.jsx";
import SideNav from "../main/SideNav.jsx";
import "./MainLayout.css";

function MainLayout({ children, teams = [], setCurrentTeam = () => {} }) {
	return (
		<>
			<MainNav teams={teams} setCurrentTeam={setCurrentTeam} />

			<div className="main-layout">
				<div className="side-nav-wrapper">
					<SideNav />
				</div>
				<div className="main-content">
					{children}
				</div>
			</div>
		</>
	);
}

export default MainLayout;

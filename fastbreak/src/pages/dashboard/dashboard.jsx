import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WelcomeMessage from "../../components/dashboard/welcomeMessage.jsx";
import MainLayout from "../../components/main/MainLayout.jsx";
import { GetCoachDashboardData, GetPlayerDashboardData } from "../../services/dashboard.js";
import DashboardTeamStats from "../../components/dashboard/TeamStats.jsx";
import DashboardPlayerIndividualStats from "../../components/dashboard/PlayerIndividualStats.jsx";
import DashboardAllIndividualStats from "../../components/dashboard/AllIndividualStats.jsx";
import DashboardRecentGames from "../../components/dashboard/DashboardRecentGames.jsx";
import './dashboard.css';
import Loader from "../../components/universal/Loader.jsx";

function Dashboard() {
	const { teamId } = useParams();
	const token = localStorage.getItem("access_token");

	const [user, setUser] = useState(null);
	const [teams, setTeams] = useState([]);
	const [currentTeam, setCurrentTeam] = useState(null);
	const [role, setRole] = useState(null);
	const [dashboardData, setDashboardData] = useState(null);

	useEffect(() => {
		setDashboardData(null);
	}, [teamId]);

	useEffect(() => {
		const fetchTeamsAndUser = async () => {
			try {
				const storedUser = JSON.parse(localStorage.getItem("user"));
				const storedTeams = JSON.parse(localStorage.getItem("teams"));
				if (!storedUser || !storedTeams || !teamId) return;

				setUser(storedUser);
				setTeams(storedTeams);

				const matchedTeam = storedTeams.find((t) => t.team.id === teamId);
				if (!matchedTeam) {
					setCurrentTeam(null);
					setRole(null);
					return;
				}
				setCurrentTeam(matchedTeam.team);
				setRole(matchedTeam.role);

				if (matchedTeam.role === "coach") {
					const coachData = await GetCoachDashboardData(token, teamId);
					setDashboardData(coachData);
				} else if (matchedTeam.role === "player") {
					const playerData = await GetPlayerDashboardData(token, storedUser.id, teamId);
					setDashboardData(playerData);
				}
			} catch (error) {
				console.error("Error loading dashboard info:", error);
			}
		};

		fetchTeamsAndUser();
	}, [teamId, token]);

	return (
		<MainLayout teams={teams} currentTeam={currentTeam}>
			<div className="dashboard-grid">
				{dashboardData ? (
					<>
						<div className="dashboard-welcome-message-wrapper">
							<WelcomeMessage currentTeam={currentTeam} />
						</div>

						<div className="dashboard-team-stats-wrapper">
							<DashboardTeamStats dashboardData={dashboardData} />
						</div>

						<div className="dashboard-individual-stats-wrapper">
							{role === "player" ? (
								<DashboardPlayerIndividualStats dashboardData={dashboardData} user_name={user.name} />
							) : (
								<DashboardAllIndividualStats dashboardData={dashboardData} />
							)}
						</div>

						<div className="dashboard-recent-games-wrapper">
							<DashboardRecentGames dashboardData={dashboardData} />
						</div>
					</>
				) : (
					<div className="dashboard-loader"><Loader /></div>
				)}
			</div>
		</MainLayout>
	);
}

export default Dashboard;

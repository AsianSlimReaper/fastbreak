import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WelcomeMessage from "../../components/dashboard/welcomeMessage.jsx";
import MainLayout from "../../components/main/MainLayout.jsx";
import { GetCoachDashboardData, GetPlayerDashboardData } from "../../services/dashboard.js";
import DashboardTeamStats from "../../components/dashboard/TeamStats.jsx";
import DashboardPlayerIndividualStats from "../../components/dashboard/PlayerIndividualStats.jsx";
import DashboardAllIndividualStats from "../../components/dashboard/AllIndividualStats.jsx";
import DashboardRecentGames from "../../components/dashboard/DashboardRecentGames.jsx";
import './dashboard.css'

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
		const fetchDashboardInfo = async () => {
			try {
				const userData = JSON.parse(localStorage.getItem("user"));
				const teamMembershipsData = JSON.parse(localStorage.getItem("teams"));

				if (!userData || !teamMembershipsData || !teamId) return;

				setUser(userData);
				setTeams(teamMembershipsData);

				const matchedTeam = teamMembershipsData.find(
					(team) => team.team.id === teamId
				);

				if (!matchedTeam) return;

				const resolvedRole = matchedTeam.role;
				setCurrentTeam(matchedTeam.team);
				setRole(resolvedRole);

				// Fetch dashboard data based on role
				if (resolvedRole === "coach") {
					const coachData = await GetCoachDashboardData(token, teamId);
					setDashboardData(coachData);
				} else if (resolvedRole === "player") {
					const playerData = await GetPlayerDashboardData(token, userData.id, teamId);
					setDashboardData(playerData);
				}
			} catch (error) {
				console.error("Error loading dashboard info:", error);
			}
		};

		fetchDashboardInfo();
	}, [teamId, token]);

	return (
		<MainLayout setCurrentTeam={setCurrentTeam} teams={teams}>
			<div className="dashboard-grid">
				{dashboardData && (
					<>
						<div className='dashboard-welcome-message-wrapper'>
							<WelcomeMessage user={user} currentTeam={currentTeam} />
						</div>

						<div className='dashboard-team-stats-wrapper'>
							<DashboardTeamStats DashboardData={dashboardData} />
						</div>

						<div className='dashboard-individual-stats-wrapper'>
							{role === "player" ? (
								<DashboardPlayerIndividualStats DashboardData={dashboardData} />
							) : (
								<DashboardAllIndividualStats DashboardData={dashboardData} />
							)}
						</div>

						<div className='dashboard-recent-games-wrapper'>
							<DashboardRecentGames dashboardData={dashboardData} />
						</div>
					</>
				)}
				{!dashboardData && <p>Loading dashboard...</p>}
			</div>

		</MainLayout>
	);
}

export default Dashboard;

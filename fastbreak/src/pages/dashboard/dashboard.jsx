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
	// initialize variables
	const { teamId } = useParams();
	const token = localStorage.getItem("access_token");

	//initialize state variables
	const [user, setUser] = useState(null);
	const [teams, setTeams] = useState([]);
	const [currentTeam, setCurrentTeam] = useState(null);
	const [role, setRole] = useState(null);
	const [dashboardData, setDashboardData] = useState(null);

	// reset dashboard data when teamId changes
	useEffect(() => {
		setDashboardData(null);
	}, [teamId]);

	// fetch user and teams from localStorage and get dashboard data based on role
	useEffect(() => {
		const fetchTeamsAndUser = async () => {
			try {
				// get user and teams from localStorage
				const storedUser = JSON.parse(localStorage.getItem("user"));
				const storedTeams = JSON.parse(localStorage.getItem("teams"));
				// check if user, teams, and teamId are available
				if (!storedUser || !storedTeams || !teamId) return;

				// set user and teams state
				setUser(storedUser);
				setTeams(storedTeams);

				// find the team that matches the teamId
				const matchedTeam = storedTeams.find((t) => t.team.id === teamId);
				// if no team matches, reset currentTeam and role
				if (!matchedTeam) {
					setCurrentTeam(null);
					setRole(null);
					return;
				}
				// set current team and role based on matched team
				setCurrentTeam(matchedTeam.team);
				setRole(matchedTeam.role);

				// fetch dashboard data based on role
				if (matchedTeam.role === "coach") {
					//call the API to get coach dashboard data
					const coachData = await GetCoachDashboardData(token, teamId);
					// set the dashboard data for coach
					setDashboardData(coachData);
				} else if (matchedTeam.role === "player") {
					// call the API to get player dashboard data
					const playerData = await GetPlayerDashboardData(token, storedUser.id, teamId);
					// set the dashboard data for player
					setDashboardData(playerData);
				}
			} catch (error) {
				// handle any errors that occur during the fetch
				console.error("Error loading dashboard info:", error);
			}
		};
		// call the function to fetch teams and user
		fetchTeamsAndUser();
	}, [teamId, token]);

	return (
		<MainLayout teams={teams}>
			<div className="dashboard-grid">
				{dashboardData ? (
					<>
						<div className="dashboard-welcome-message-wrapper">
							<WelcomeMessage currentTeam={currentTeam} />
						</div>

						<div className="dashboard-team-stats-wrapper">
							<DashboardTeamStats teamStats={dashboardData.team_stats} />
						</div>

						<div className="dashboard-individual-stats-wrapper">
							{role === "player" ? (
								<DashboardPlayerIndividualStats IndividualStats={dashboardData.individual_stats} user_name={user.name} />
							) : (
								<DashboardAllIndividualStats IndividualStats={dashboardData.individual_stats} />
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

import axios from "axios";
import {BASE_URL} from "./api.js";

export const GetTeamMemberships = async (userId, token) => {
	try{
		const response = await axios.get(`${BASE_URL}/teams/memberships/user/${userId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
		return response.data;
	} catch(error) {
		console.error("Error fetching team memberships:", error);
		throw error;
	}
};

export const CreateTeam = async(teamName, token) => {
	try{
		const response = await axios.post(`${BASE_URL}/teams/`,
		{
			team_name:teamName
		},
		{
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data;
	} catch(error) {
		console.error("Error creating team:", error);
		throw error;
	}
}

export const JoinTeam = async(teamId, userId, role, position,jerseyNumber, token) => {
	try{
		const response = await axios.post(`${BASE_URL}/teams/memberships`,
		{
			team_id:teamId,
			user_id:userId,
			role:role,
			position:position,
			jersey_number:jerseyNumber
		},
		{
			headers: { Authorization: `Bearer ${token}` }
		});
		return response.data
	} catch(error) {
		console.error("Error joining team:", error);
		throw error;
	}
}
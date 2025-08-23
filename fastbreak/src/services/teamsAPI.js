import axios from "axios";
import {BASE_URL} from "./api.js";

// purpose: get the memberships of a user in teams
//input: userId, token
//output: team memberships of the user
export const GetTeamMemberships = async (userId, token) => {
	try{
		// fetch the team memberships of the user
		const response = await axios.get(`${BASE_URL}/teams/memberships/user/${userId}`, {
			// using the token for authorization
		headers: { Authorization: `Bearer ${token}` }
	});
		// return the data from the response
		return response.data;
	} catch(error) {
		// log the error and throw it
		console.error("Error fetching team memberships:", error);
		throw error;
	}
};

// purpose: get the teams of a user
// input: userId, token
// output: teams of the user
export const CreateTeam = async(teamName, token) => {
	try{
		// create a new team with the given team name
		const response = await axios.post(`${BASE_URL}/teams/`,
			// using the token for authorization
		{
			team_name:teamName
		},
		{
			headers: { Authorization: `Bearer ${token}` } // using the token for authorization
		});
		// return the data from the response
		return response.data;
	} catch(error) {
		// log the error and throw it
		console.error("Error creating team:", error);
		throw error;
	}
}

// purpose: to join a team
// input: teamId, userId, role, position, jerseyNumber, token
// output: response from the server
export const JoinTeam = async(teamId, userId, role, position,jerseyNumber, token) => {
	try{
		// join a team with the given teamId, userId, role, position, and jerseyNumber
		const response = await axios.post(`${BASE_URL}/teams/memberships`,
			// using the token for authorization
		{
			team_id:teamId,
			user_id:userId,
			role:role,
			position:position,
			jersey_number:jerseyNumber
		},
		{
			headers: { Authorization: `Bearer ${token}` } // using the token for authorization
		});
		// return the data from the response
		return response.data
	} catch(error) {
		// log the error and throw it
		console.error("Error joining team:", error);
		throw error;
	}
}
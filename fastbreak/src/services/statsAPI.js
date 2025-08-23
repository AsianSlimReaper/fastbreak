import axios from "axios";
import {BASE_URL} from "./api.js";

//purpose: get the individual stats for a team
//input: teamId, token
//output: individual stats for the team
export const getIndividualStats = async(teamId,token) =>{
	try{
		// Fetch individual stats for a team
		const response = await axios.get(`${BASE_URL}/stats/individual/${teamId}`,
			{
				headers: {
					'Authorization': `Bearer ${token}` // Include the token in the request headers
				},
			}
		);
		// Return the data from the response
		return response.data;
	} catch(error){
		// Log the error and rethrow it for further handling
		console.error("Error fetching individual stats:", error);
		throw error;
	}
}

//purpose: get the team stats for a team
//input: teamId, token
//output: team stats for the team
export const getTeamStats = async(teamId,token) =>{
	try{
		// Fetch team stats for a team
		const response = await axios.get(`${BASE_URL}/stats/team/${teamId}`,
			{
				headers: {
					'Authorization': `Bearer ${token}` // Include the token in the request headers
				},
			}
		);
		// Return the data from the response
		return response.data;
	}
	catch(error){
		// Log the error and rethrow it for further handling
		console.error("Error fetching team stats:", error);
		throw error;
	}
}

export const getIndividualShootingStats = async(teamId,token) =>{
	try{
		const response = await axios.get(`${BASE_URL}/stats/individual/shooting/${teamId}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				},
			}
		);
		return response.data;
	} catch(error){
		console.error("Error fetching individual shooting stats:", error);
		throw error;
	}
}

export const getTeamShootingStats = async(teamId,token) =>{
	try{
		const response = await axios.get(`${BASE_URL}/stats/team/shooting/${teamId}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				},
			}
		);
		return response.data;
	} catch(error){
		console.error("Error fetching team shooting stats:", error);
		throw error;
	}
}
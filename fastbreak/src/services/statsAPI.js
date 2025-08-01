import axios from "axios";
import {BASE_URL} from "./api.js";

export const getIndividualStats = async(teamId,token) =>{
	try{
		const response = await axios.get(`${BASE_URL}/stats/individual/${teamId}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				},
			}
		);
		return response.data;
	} catch(error){
		console.error("Error fetching individual stats:", error);
		throw error;
	}
}

export const getTeamStats = async(teamId,token) =>{
	try{
		const response = await axios.get(`${BASE_URL}/stats/team/${teamId}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				},
			}
		);
		return response.data;
	}
	catch(error){
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
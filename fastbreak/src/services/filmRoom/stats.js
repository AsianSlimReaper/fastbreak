import {BASE_URL} from "../api.js";
import axios from "axios";

//purpose: get basic and shooting stats for a game
//input: token, gameId
//output: basic and shooting stats for the game
export const GetBasicStats = async(token,gameId) =>{
	try{
		// Fetch basic stats for a game
		const response = await axios.get(`${BASE_URL}/film-room/basic-box-scores/${gameId}`,
			{
				headers:{
					'Authorization': `Bearer ${token}` // Include the token in the request headers
				}
			})
		// Return the data from the response
		return response.data
	}catch(error){
		// Log the error and rethrow it
		console.error("error getting basic stats",error)
		throw error
	}
}

//purpose: get shooting stats for a game
//input: token, gameId
//output: shooting stats for the game
export const GetShootingStats = async(token,gameId) =>{
	try{
		// Fetch shooting stats for a game
		const response = await axios.get(`${BASE_URL}/film-room/shooting-box-scores/${gameId}`,
			{
				headers:{
					'Authorization': `Bearer ${token}` // Include the token in the request headers
				}
			})
		// Return the data from the response
		return response.data
	}catch(error){
		// Log the error and rethrow it
		console.error("error getting shooting stats",error)
		throw error
	}
}


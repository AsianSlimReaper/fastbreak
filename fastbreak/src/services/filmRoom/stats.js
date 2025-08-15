import {BASE_URL} from "../api.js";
import axios from "axios";

export const GetBasicStats = async(token,gameId) =>{
	try{
		const response = await axios.get(`${BASE_URL}/film-room/basic-box-scores/${gameId}`,
			{
				headers:{
					'Authorization': `Bearer ${token}`
				}
			})
		return response.data
	}catch(error){
		console.error("error getting basic stats",error)
		throw error
	}
}

export const GetShootingStats = async(token,gameId) =>{
	try{
		const response = await axios.get(`${BASE_URL}/film-room/shooting-box-scores/${gameId}`,
			{
				headers:{
					'Authorization': `Bearer ${token}`
				}
			})
		return response.data
	}catch(error){
		console.error("error getting shooting stats",error)
		throw error
	}
}


import {BASE_URL} from "../api.js";
import axios from "axios";

export const GetComments = async(token,gameId) =>{
	try{
		const response = await axios.get(`${BASE_URL}/film-room/comments/${gameId}`,
			{
				headers:{
					'Authorization': `Bearer ${token}`
				}
			})
		return response.data
	}catch(error){
		console.error("error getting comments",error)
		throw error
	}
}
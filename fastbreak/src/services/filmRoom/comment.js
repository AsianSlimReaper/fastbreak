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

export const CreateComment = async (token, comments) => {
  	try {
    	const response = await axios.post(
      	`${BASE_URL}/film-room/comments`,
      		Array.isArray(comments) ? comments : [comments], // ensure it's an array
      		{
        		headers: {
          			'Authorization': `Bearer ${token}`,
          			'Content-Type': 'application/json' // make sure content type is JSON
        		}
      		}
    	);
    	return response.data;
  	} catch (error) {
    	console.error("error creating comment", error);
    	throw error;
  	}
};

import {BASE_URL} from "../api.js";
import axios from "axios";

//purpose: get comments for a specific game
//input: token, gameId
//output: comments
export const GetComments = async(token,gameId) =>{
	try{
		// Fetch comments for a specific game
		const response = await axios.get(`${BASE_URL}/film-room/comments/${gameId}`, //url
			{
				headers:{
					'Authorization': `Bearer ${token}` //ensure token is passed in headers
				}
			})
		// Return the data from the response
		return response.data
	}catch(error){
		// Log the error and rethrow it
		console.error("error getting comments",error)
		throw error
	}
}

//purpose: create a comment for a specific game
//input: token, comments (can be a single comment or an array of comments)
//output: created comment(s)
export const CreateComment = async (token, comments) => {
  	try {
		  // Check if comments is an array, if not, convert it to an array
    	const response = await axios.post(
      	`${BASE_URL}/film-room/comments`,
      		Array.isArray(comments) ? comments : [comments], // ensure it's an array
      		{
        		headers: {
          			'Authorization': `Bearer ${token}`, // ensure token is passed in headers
          			'Content-Type': 'application/json' // make sure content type is JSON
        		}
      		}
    	);
		// Return the data from the response
    	return response.data;
  	} catch (error) {
		  // Log the error and rethrow it
    	console.error("error creating comment", error);
    	throw error;
  	}
};

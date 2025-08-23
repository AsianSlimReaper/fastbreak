import axios from "axios";
import {BASE_URL} from "../api.js";

//purpose: Fetches the box score for a specific game
//input: token, gameId
//output: box score data
export const UpdateBoxScore = async (token, gameId, boxScore) => {
	try {
		//call the API to update the box score
		const response = await axios.patch(
			`${BASE_URL}/film-room/box-score/${gameId}`, //url
			boxScore, //data
			{
				headers: {
					'Authorization': `Bearer ${token}`, //set the authorization header with the token
					'Content-Type': 'application/json' //ensure the content type is set to JSON
				}
			})
		// return the updated box score data
		return response.data;
	}catch(error) {
		// log the error and rethrow it
		console.error("Failed updating box score", error);
		throw error;
	}
}
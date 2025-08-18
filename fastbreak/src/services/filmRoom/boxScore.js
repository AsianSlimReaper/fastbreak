import axios from "axios";
import {BASE_URL} from "../api.js";

export const UpdateBoxScore = async (token, gameId, boxScore) => {
	try {
		const response = await axios.patch(
			`${BASE_URL}/film-room/box-score/${gameId}`,
			boxScore,
			{
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})
		return response.data;
	}catch(error) {
		console.error("Failed updating box score", error);
		throw error;
	}
}
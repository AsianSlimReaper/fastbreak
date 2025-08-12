import {BASE_URL} from "../api.js";
import axios from "axios";

export const GetAllGames = async(token,teamId) =>{
    try{
        const response = await axios.get(`${BASE_URL}/film-room/all-games/${teamId}`,
            {
                headers: {
					'Authorization': `Bearer ${token}`
				},
            }
        );
        return response.data;
    }catch(error){
        console.error("Error fetching games:", error);
        throw error;
    }
}



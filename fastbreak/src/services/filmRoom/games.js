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

export const GetGameDetails = async(token,game_id) =>{
    try{
        const response = await axios.get(`${BASE_URL}/film-room/game-details/${game_id}`,
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

export const CreateGame = async(token,{gameData}) => {
    try{
        const response = await axios.post(`${BASE_URL}/film-room/new-game`,
            {
                "team_id":gameData.team_id,
                "opponent":gameData.opponent,
                "date":gameData.date,
                "video_url":gameData.video_url
            },
            {headers: {
                    'Authorization': `Bearer ${token}`
                    }
                },
    )
        return response.data
    }catch(error){
        console.error("Error fetching games:", error);
        throw error;
    }
}

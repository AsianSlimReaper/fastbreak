import {BASE_URL} from "../api.js";
import axios from "axios";

export const CreatePlayByPlays = async (token, playByPlays) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/film-room/play-by-plays`,
            playByPlays,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed creating play-by-plays", error);
        throw error;
    }
};

export const GetPlayByPlays = async (token, gameId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/film-room/play-by-plays`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: { game_id: gameId }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed getting play-by-plays", error);
        throw error;
    }
};


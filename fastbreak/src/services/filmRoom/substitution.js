import axios from "axios";
import { BASE_URL } from "../api.js";

export const GetSubs = async (token, gameId) => {
    try {
        const response = await axios.get(`${BASE_URL}/film-room/subs/${gameId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed getting subs", error);
        throw error;
    }
};

// CREATE new substitutions
export const CreateSubs = async (token, subsData) => {
    try {
        const response = await axios.post(`${BASE_URL}/film-room/subs`, subsData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed creating subs", error);
        throw error;
    }
};

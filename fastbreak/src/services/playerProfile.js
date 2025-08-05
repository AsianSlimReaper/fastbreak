import {BASE_URL} from "./api.js";
import axios from "axios";

export const getTeamProfileCards = async (teamId,token) => {
    try {
        const response = await axios.get(`${BASE_URL}/player-profile/player-cards/${teamId}`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
        return response.data;
    } catch (error) {
        console.error("Error fetching team profile cards:", error);
        throw error;
    }
}

export const getPlayerProfile = async (teamId,userId, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/player-profile/player-profile/${teamId}/${userId}`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
        return response.data;
    } catch (error) {
        console.error("Error fetching player profile:", error);
        throw error;
    }
}
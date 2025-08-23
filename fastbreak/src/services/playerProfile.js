import {BASE_URL} from "./api.js";
import axios from "axios";

//purpose: Fetches the player profile cards for a specific team
//input: teamId and token
//output: Returns a promise that resolves to the player profile cards data
export const getTeamProfileCards = async (teamId,token) => {
    try {
        // Fetches all player profile cards for a specific team
        const response = await axios.get(`${BASE_URL}/player-profile/player-cards/${teamId}`,
            {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
            });
        // Returns the data from the response
        return response.data;
    } catch (error) {
        // Logs the error to the console and rethrows it
        console.error("Error fetching team profile cards:", error);
        throw error;
    }
}

//purpose: Fetches the player profile for a specific user in a team
//input: teamId, userId and token
//output: Returns a promise that resolves to the player profile data
export const getPlayerProfile = async (teamId,userId, token) => {
    try {
        // Fetches the player profile for a specific user in a team
        const response = await axios.get(`${BASE_URL}/player-profile/player-profile/${teamId}/${userId}`,
            {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
            });
        // Returns the data from the response
        return response.data;
    } catch (error) {
        // Logs the error to the console and rethrows it
        console.error("Error fetching player profile:", error);
        throw error;
    }
}
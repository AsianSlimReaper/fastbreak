import axios from "axios";
import { BASE_URL } from "./api.js";

//purpose: fetch coach dashboard data
//input: token, teamId
//output: response data
export const GetCoachDashboardData = async (token, teamId) => {
    try {
        // Fetching coach dashboard data from the API
        const response = await axios.get(
            `${BASE_URL}/dashboard/dashboard/coach/${teamId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request headers
                },
            }
        );
        // Return the data from the response
        return response.data;
    } catch (error) {
        //log the error in the console and rethrow it
        console.error("Error fetching coach dashboard data:", error);
        throw error;
    }
};

// Purpose: Fetch player dashboard data
// Input: token, userId, teamId
// Output: response data
export const GetPlayerDashboardData = async (token, userId, teamId) => {
    try {
        // Fetching player dashboard data from the API
        const response = await axios.get(
            `${BASE_URL}/dashboard/dashboard/player/${userId}/${teamId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request headers
                },
            }
        );
        // Return the data from the response
        return response.data;
    } catch (error) {
        // Log the error in the console and rethrow it
        console.error("Error fetching player dashboard data:", error);
        throw error;
    }
};

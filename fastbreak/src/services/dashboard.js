import axios from "axios";
import { BASE_URL } from "./api.js";

export const GetCoachDashboardData = async (token, teamId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/dashboard/dashboard/coach/${teamId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching coach dashboard data:", error);
        throw error;
    }
};

export const GetPlayerDashboardData = async (token, userId, teamId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/dashboard/dashboard/player/${userId}/${teamId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching player dashboard data:", error);
        throw error;
    }
};

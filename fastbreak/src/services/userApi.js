import axios from "axios";
import {BASE_URL} from "./api.js";

export const GetUser = async (token) => {
    try{
        const response = await axios.get(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
        return response.data;
    } catch(error){
        console.error("Error fetching user data:", error);
        throw error;
    }
};

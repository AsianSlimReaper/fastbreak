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

export const UpdateUser = async(token,userId, name, email, password) => {
    try{
        const payload = {};

        if (name) payload.name = name;
        if (email) payload.email = email;
        if (password) payload.password = password;

        const response = await axios.patch(
            `${BASE_URL}/users/${userId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch(error){
        console.error("Error updating user data:", error);
        throw error;
    }
}

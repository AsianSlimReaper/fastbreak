import axios from "axios";
import { BASE_URL } from "../api.js";

// purpose: Get all substitutions for a specific game
//input: token (string), gameId (string)
// output: list of substitutions
export const GetSubs = async (token, gameId) => {
    try {
        // Fetch substitutions for a specific game
        const response = await axios.get(`${BASE_URL}/film-room/subs/${gameId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });
        // Return the data from the response
        return response.data;
    } catch (error) {
        // Log the error and rethrow it for further handling
        console.error("Failed getting subs", error);
        throw error;
    }
};

// purpose: Create a new substitution
// input: token (string), subsData (object)
// output: created substitution object
export const CreateSubs = async (token, subsData) => {
    try {
        // Create a new substitution by sending a POST request
        const response = await axios.post(`${BASE_URL}/film-room/subs`, subsData, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the request headers
                'Content-Type': 'application/json' // Set the content type to JSON
            }
        });
        // Return the created substitution data from the response
        return response.data;
    } catch (error) {
        // Log the error and rethrow it for further handling
        console.error("Failed creating subs", error);
        throw error;
    }
};

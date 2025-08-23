import axios from "axios";
import {BASE_URL} from "./api.js";

//purpose: get the user data of the currently logged-in user
//input: token - the authentication token of the user
//output: user data object
export const GetUser = async (token) => {
    try{
        // Make a GET request to the user endpoint with the token
        const response = await axios.get(`${BASE_URL}/users/me`, {
            // Include the token in the Authorization header
        headers: { Authorization: `Bearer ${token}` }
    });
        // Return the user data from the response
        return response.data;
    } catch(error){
        // Handle any errors that occur during the request
        console.error("Error fetching user data:", error);
        throw error;
    }
};


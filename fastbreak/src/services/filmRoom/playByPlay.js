import {BASE_URL} from "../api.js";
import axios from "axios";

//purpose: Create play-by-plays for a game
//input: token - user's authentication token, playByPlays - array of play-by-play objects
//output: response data from the API
export const CreatePlayByPlays = async (token, playByPlays) => {
    try {
        // call the API to create play-by-plays
        const response = await axios.post(
            `${BASE_URL}/film-room/play-by-plays`,
            // the play-by-plays data
            playByPlays,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // user's authentication token
                    'Content-Type': 'application/json' // content type for the request
                }
            }
        );
        // return the response data
        return response.data;
    } catch (error) {
        // log the error and rethrow it
        console.error("Failed creating play-by-plays", error);
        throw error;
    }
};

//purpose: Get play-by-plays for a game
//input: token - user's authentication token, gameId - ID of the game
//output: response data from the API containing play-by-plays
export const GetPlayByPlays = async (token, gameId) => {
    try {
        // call the API to get play-by-plays for the specified game
        const response = await axios.get(
            `${BASE_URL}/film-room/play-by-plays`,
            {
                headers: {
                    'Authorization': `Bearer ${token}` // user's authentication token
                },
                params: { game_id: gameId } // game ID to filter play-by-plays
            }
        );
        // return the response data containing play-by-plays
        return response.data;
    } catch (error) {
        // log the error and rethrow it
        console.error("Failed getting play-by-plays", error);
        throw error;
    }
};


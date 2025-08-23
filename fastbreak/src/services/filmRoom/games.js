import {BASE_URL} from "../api.js";
import axios from "axios";

//purpose: get all games for a team
//input: token, teamId
//output: array of games
export const GetAllGames = async(token,teamId) =>{
    try{
        // Fetch all games for a specific team
        const response = await axios.get(`${BASE_URL}/film-room/all-games/${teamId}`,
            {
                headers: {
					'Authorization': `Bearer ${token}` //ensure the token is passed in the headers
				},
            }
        );
        // Return the data from the response
        return response.data;
    }catch(error){
        // Log the error and rethrow it for further handling
        console.error("Error fetching games:", error);
        throw error;
    }
}

//purpose: get details of a specific game
//input: token, game_id
//output: game details object
export const GetGameDetails = async(token,game_id) =>{
    try{
        // Fetch details of a specific game using its ID
        const response = await axios.get(`${BASE_URL}/film-room/game-details/${game_id}`,
            {
                headers: {
					'Authorization': `Bearer ${token}` //ensure the token is passed in the headers
				},
            }
        );
        // Return the game details from the response
        return response.data;
    }catch(error){
        // Log the error and rethrow it for further handling
        console.error("Error fetching games:", error);
        throw error;
    }
}

//purpose: create a new game
//input: token, gameData (object containing team_id, opponent, date, participants)
//output: created game object
export const CreateGame = async(token,gameData) => {
    try{
        // Create a new game with the provided data
        const response = await axios.post(`${BASE_URL}/film-room/new-game`,
            // Construct the game data object
            {
                "team_id":gameData.team_id,
                "opponent":gameData.opponent,
                "date":gameData.date,
                "participants": gameData.participants || []
            },
            {headers: {
                    'Authorization': `Bearer ${token}` // Pass the token in the headers for authorization
                    }
                },
    )
        // Return the created game data from the response
        return response.data
    }catch(error){
        // Log the error and rethrow it for further handling
        console.error("Error creating games:", error);
        throw error;
    }
}

//purpose: get all players for a team
//input: token, teamId
//output: array of players
export const GetTeamPlayers = async (token, teamId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/film-room/team-players/${teamId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Ensure the token is passed in the headers
                }
            }
        );
        // Return the list of players from the response
        return response.data;
    } catch (error) {
        // Log the error and rethrow it for further handling
        console.error("Error fetching team players:", error);
        throw error;
    }
};

//purpose: submit starters for a game
//input: token, gameId, starters (array of player IDs)
//output: response data from the API
export const SubmitStarters = async (token, gameId, starters) => {
    try {
        // Submit the starters for a specific game
        const response = await axios.post(
            `${BASE_URL}/film-room/subs`,
            // Construct the data object with game ID and starters
            [{
                game_id: gameId,
                timestamp_seconds: 0,
                on_court: starters
            }],
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Pass the token in the headers for authorization
                }
            }
        );
        // Return the response data from the API
        return response.data;
    } catch (error) {
        // Log the error and rethrow it for further handling
        console.error("Error submitting starters:", error);
        throw error;
    }
};

//purpose: get participants for a specific game
export const GetGameParticipants = async (token, gameId) => {
    try {
        // Fetch participants for a specific game using its ID
        const response = await axios.get(
            `${BASE_URL}/film-room/game-participants/${gameId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Ensure the token is passed in the headers
                }
            }
        );
        // Return the list of participants from the response
        return response.data;
    } catch (error) {
        // Log the error and rethrow it for further handling
        console.error("Error fetching game participants:", error);
        throw error;
    }
};

//purpose: create a new participant for a game
//input: token, game_id, user_id
//output: created participant object
export const CreateGameParticipant = async (token, { game_id, user_id }) => {
    try {
        // Create a new participant for a specific game
        const response = await axios.post(
            `${BASE_URL}/film-room/new-participant`,
            // Construct the data object with game ID and user ID
            {
                game_id,
                user_id
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Pass the token in the headers for authorization
                }
            }
        );
        // Return the created participant data from the response
        return response.data;
    } catch (error) {
        // Log the error and rethrow it for further handling
        console.error("Error adding participant:", error);
        throw error;
    }
};

//purpose: create a new box score
//input: token, boxScoreData (object containing game_id, player_id, stats)
//output: created box score object
export const CreateBoxScore = async (token, boxScoreData) => {
    try {
        // Create a new box score for a specific game
        const response = await axios.post(
            `${BASE_URL}/film-room/new-box-scores`,
            [boxScoreData], // expects a list for bulk creation
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Pass the token in the headers for authorization
                }
            }
        );
        // Return the created box score data from the response
        return response.data;
    } catch (error) {
        // Log the error and rethrow it for further handling
        console.error("Error creating box score:", error);
        throw error;
    }
};

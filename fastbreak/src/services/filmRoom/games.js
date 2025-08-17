import {BASE_URL} from "../api.js";
import axios from "axios";

export const GetAllGames = async(token,teamId) =>{
    try{
        const response = await axios.get(`${BASE_URL}/film-room/all-games/${teamId}`,
            {
                headers: {
					'Authorization': `Bearer ${token}`
				},
            }
        );
        return response.data;
    }catch(error){
        console.error("Error fetching games:", error);
        throw error;
    }
}

export const GetGameDetails = async(token,game_id) =>{
    try{
        const response = await axios.get(`${BASE_URL}/film-room/game-details/${game_id}`,
            {
                headers: {
					'Authorization': `Bearer ${token}`
				},
            }
        );
        return response.data;
    }catch(error){
        console.error("Error fetching games:", error);
        throw error;
    }
}

export const CreateGame = async(token,gameData) => {
    try{
        const response = await axios.post(`${BASE_URL}/film-room/new-game`,
            {
                "team_id":gameData.team_id,
                "opponent":gameData.opponent,
                "date":gameData.date,
                "participants": gameData.participants || []
            },
            {headers: {
                    'Authorization': `Bearer ${token}`
                    }
                },
    )
        return response.data
    }catch(error){
        console.error("Error creating games:", error);
        throw error;
    }
}

export const GetTeamPlayers = async (token, teamId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/film-room/team-players/${teamId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching team players:", error);
        throw error;
    }
};

export const SubmitStarters = async (token, gameId, starters) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/film-room/subs`,
            [{
                game_id: gameId,
                timestamp_seconds: 0,
                on_court: starters
            }],
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting starters:", error);
        throw error;
    }
};

export const GetGameParticipants = async (token, gameId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/film-room/game-participants/${gameId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching game participants:", error);
        throw error;
    }
};

export const CreateGameParticipant = async (token, { game_id, user_id }) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/film-room/new-participant`,
            {
                game_id,
                user_id
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding participant:", error);
        throw error;
    }
};

export const CreateBoxScore = async (token, boxScoreData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/film-room/new-box-scores`,
            [boxScoreData], // expects a list for bulk creation
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating box score:", error);
        throw error;
    }
};

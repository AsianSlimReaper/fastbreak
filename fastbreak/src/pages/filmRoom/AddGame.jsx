import React, { useEffect, useState } from "react";
import "./AddGame.css";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import { CreateGame, GetTeamPlayers, SubmitStarters } from "../../services/filmRoom/games.js";
import { SaveVideo } from "../../services/filmRoom/wasabi.js";
import FloatingInput from "../../components/universal/FloatingInput.jsx";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";

function AddGame() {
    //initialize hooks and state
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const { teamId } = useParams(); // Get teamId from URL params

    const [teams, setTeams] = useState([]);
    const [file, setFile] = useState(null);
    const [opponent, setOpponent] = useState("");
    const [date, setDate] = useState("");
    const [uploading, setUploading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [starters, setStarters] = useState([]);

    // Fetch team players
    useEffect(() => {
        const fetchPlayers = async () => {
            // Check if token and teamId are available
            if (!token || !teamId) return;
            try {
                // Fetch players for the team
                const data = await GetTeamPlayers(token, teamId);
                // Set players state
                setPlayers(data);
            } catch {
                // If there's an error fetching players, set players to an empty array
                console.error("Error fetching game");
                setPlayers([]);
            }
        };
        // Call the fetch function
        fetchPlayers();
    }, [token, teamId]); // Fetch players when token or teamId changes

    // Move player to participants
    const handleAddParticipant = (user_id) => {
        setSelectedParticipants((prev) => [...prev, user_id]);
    };

    // Remove player from participants (and from starters if present)
    const handleRemoveParticipant = (user_id) => {
        setSelectedParticipants((prev) => prev.filter((id) => id !== user_id));
        setStarters((prev) => prev.filter((id) => id !== user_id));
    };

    // Toggle starter (must be participant, max 5)
    const handleStarterToggle = (user_id) => {
        // Check if user_id is in selectedParticipants
        if (!selectedParticipants.includes(user_id)) return;
        // Toggle starter status
        setStarters((prev) => {
            // If user_id is already a starter, remove it; otherwise, add it if there are less than 5 starters
            if (prev.includes(user_id)) {
                return prev.filter((id) => id !== user_id);
            } else if (prev.length < 5) {
                return [...prev, user_id]; //return the previous state with the new starter added
            } //prev is the previous state of starters
            return prev;
        });
    };

    // Handle form submission to add a game
    const handleAddGame = async () => {
        // Validate inputs
        if (!file || !opponent || !date) {
            return alert("Please fill in the form before submitting");
        }
        if (!token) {
            return alert("Not Authorised");
        }
        if (starters.length !== 5) {
            return alert("Please select exactly 5 starters.");
        }
        try {
            // Prepare game data and upload and avoid resubmitting if already uploading
            setUploading(true);

            // create new object with the game data
            const gameData = {
                team_id: teamId,
                opponent: opponent,
                date: date,
                participants: selectedParticipants
            };

            // Create the game using the CreateGame service
            const game = await CreateGame(token, gameData);

            // save the video file and staters
            await SubmitStarters(token, game.id, starters);
            await SaveVideo(token, game.id, file);

            // Navigate to the edit game page with the created game ID
            navigate(`/film-room/game/edit-game/${teamId}/${game.id}`);
        } catch (error) {
            // Handle errors during game creation
            console.error("Error creating game", error);
            alert("Error creating game");
        } finally {
            // Reset uploading state
            setUploading(false);
        }
    };

    // Load teams from localStorage when component mounts or teamId changes
    useEffect(() => {
        // Check if teamId is available and load teams from localStorage
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        // If teams are stored and teamId is available, set the teams state
        if (storedTeams && teamId) {
            setTeams(storedTeams);
        }
    }, [teamId]); // Load teams when teamId changes

    // Compute available and participant players
    // Filter players based on selected participants
    const availablePlayers = players.filter((p) => !selectedParticipants.includes(p.user_id));
    const participantPlayers = players.filter((p) => selectedParticipants.includes(p.user_id));

    return (
        <MainLayout teams={teams}>
            <div className="add-game-container">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddGame();
                    }}
                    className="add-game-form"
                >
                    <h2>Add Game</h2>

                    <FloatingInput
                        label="Opponent"
                        id="opponent"
                        type="text"
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                    />
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <input
                        id="file"
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    {/* Participants */}
                    <div className='participant-wrapper'>
                        {/* Available Players */}
                        <div className="participants-section">
                            <h3>Available Players</h3>
                            <ul>
                                {availablePlayers.map((p) => (
                                    <li
                                        key={p.user_id}
                                        onClick={() => handleAddParticipant(p.user_id)}
                                        className="player-row"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={false}
                                            readOnly
                                        />
                                        <span>{p.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Game Participants */}
                        <div className="participants-section">
                            <h3>Game Participants</h3>
                            <ul>
                                {participantPlayers.map((p) => (
                                    <li
                                        key={p.user_id}
                                        onClick={() => handleRemoveParticipant(p.user_id)}
                                        className="player-row"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={true}
                                            readOnly
                                        />
                                        <span>{p.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Starters */}
                        <div className="starters-section">
                            <h3>Select Starters</h3>
                            <ul>
                                {participantPlayers.map((p) => (
                                    <li
                                        key={p.user_id}
                                        onClick={() => handleStarterToggle(p.user_id)}
                                        className="player-row"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={starters.includes(p.user_id)}
                                            readOnly
                                        />
                                        <span>{p.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <ButtonComponent
                        type="submit"
                        disabled={
                            !opponent || !date || !file || uploading || starters.length !== 5
                        }
                    >
                        {uploading ? "Creating Game..." : "Create Game"}
                    </ButtonComponent>
                </form>
            </div>
        </MainLayout>
    );
}

export default AddGame;

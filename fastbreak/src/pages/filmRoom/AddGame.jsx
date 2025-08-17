import React, { useEffect, useState } from "react";
import "./AddGame.css";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import { CreateGame, GetTeamPlayers, SubmitStarters } from "../../services/filmRoom/games.js";
import { SaveVideo } from "../../services/filmRoom/wasabi.js";
import FloatingInput from "../../components/universal/FloatingInput.jsx";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";

function AddGame() {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const { teamId } = useParams();

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
            if (!token || !teamId) return;
            try {
                const data = await GetTeamPlayers(token, teamId);
                setPlayers(data);
            } catch {
                setPlayers([]);
            }
        };
        fetchPlayers();
    }, [token, teamId]);

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
        if (!selectedParticipants.includes(user_id)) return;
        setStarters((prev) => {
            if (prev.includes(user_id)) {
                return prev.filter((id) => id !== user_id);
            } else if (prev.length < 5) {
                return [...prev, user_id];
            }
            return prev;
        });
    };

    const handleAddGame = async () => {
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
            setUploading(true);

            const gameData = {
                team_id: teamId,
                opponent: opponent,
                date: date,
                participants: selectedParticipants
            };

            const game = await CreateGame(token, gameData);

            await SubmitStarters(token, game.id, starters);
            await SaveVideo(token, game.id, file);

            navigate(`/film-room/game/edit-game/${teamId}/${game.id}`);
        } catch (error) {
            console.error("Error creating game", error);
            alert("Error creating game");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        if (storedTeams && teamId) {
            setTeams(storedTeams);
        }
    }, [teamId]);

    // Compute available and participant players
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

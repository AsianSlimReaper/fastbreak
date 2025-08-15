import React, { useEffect, useState } from "react";
import "./AddGame.css";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import {CreateGame, GetTeamPlayers} from "../../services/filmRoom/games.js";
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
    const [players,setPlayers] = useState([])

    const handleAddGame = async () => {
        if (!file || !opponent || !date) {
            return alert("Please fill in the form before submitting");
        }

        if (!token) {
            return alert("Not Authorised");
        }

        try {
            setUploading(true);

            const gameData = {
                team_id: teamId,
                opponent: opponent,
                date: date
            };

            const game = await CreateGame(token, gameData);

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

    useEffect(()=>{
        const fetchplayer = async() =>{
            try{
                const teamPlayers = await GetTeamPlayers(token,teamId)
                setPlayers(teamPlayers)
            }catch(error){
                console.error("error getting players",error)
                alert("error getting players")
            }
        }
        fetchplayer()
    },[token,teamId])

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
                        onChange={(e) => setFile(e.target.files[0])} // fixed: removed value prop
                    />
                    <ButtonComponent
                        type="submit"
                        disabled={!opponent || !date || !file || uploading}
                    >
                        {uploading ? "Creating Game" : "Create Game"}
                    </ButtonComponent>
                </form>
            </div>
        </MainLayout>
    );
}

export default AddGame;

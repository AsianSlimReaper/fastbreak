import React from "react";
import './FilmHomeTable.css';
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../universal/ButtonComponent.jsx";

function FilmHomeTable({ games, role, teamId }) {
    const navigate = useNavigate();

    const navigateAddGame = () => {
        navigate(`/film-room/add-game/${teamId}`);
    };

    const navigateEditGame = (gameId) => {
        navigate(`/film-room/game/edit-game/${teamId}/${gameId}`);
    };

    const navigateViewGame = (gameId) => {
        navigate(`/film-room/game/view-game/${teamId}/${gameId}`);
    };

    return (
        <div className='film-home-table-container'>
            <h2>Games</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th>Score</th>
                        <th>Result</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id}>
                            <td>{game.date}</td>
                            <td>{game.opponent}</td>
                            <td>{game.team_score}-{game.opponent_score}</td>
                            <td>{game.result}</td>
                            <td>
                                <ButtonComponent onClick={() => navigateViewGame(game.game_id)}>View Game</ButtonComponent>
                                {role === "coach" && (
                                    <ButtonComponent onClick={() => navigateEditGame(game.game_id)}>Edit Game</ButtonComponent>
                                )}
                            </td>
                        </tr>
                    ))}
                    {role === "coach" && (
                        <tr key='add-game'>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                <ButtonComponent onClick={navigateAddGame}>+ Add Game</ButtonComponent>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default FilmHomeTable;

import React, {useEffect, useState} from "react";
import "./AddGame.css"
import {useNavigate, useParams} from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import {CreateGame} from "../../services/filmRoom/games.js";
import {SaveVideo} from "../../services/filmRoom/wasabi.js";
import FloatingInput from "../../components/universal/FloatingInput.jsx";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";

function AddGame(){
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const { teamId } = useParams();
    const [teams, setTeams] = useState([]);

    const [file,setFile] = useState(null);
    const [gameId,setGameId] = useState('');
    const [video,setVideo] = useState(null);
    const [opponent,setOpponent] = useState('');
    const [date,setDate] = useState(null);
    const [uploading,setUploading] = useState(false);

    const handleAddGame = async() =>{
        if (!file || !opponent || !date){
            return alert("Please fill in the form before submitting");
        }

        if (!token){
            return alert("Not Authorised");
        }

        try{
            const gameData = {
                "teamId":teamId,
                "opponent":opponent,
                "date":date
            };
            const game = await CreateGame(token,gameData);
            setGameId(game.id);

            const video = await SaveVideo(token,game.id,file);
            setVideo(video);

            navigate(`/film-room/game/edit-game/${teamId}/${game.id}`)
        }catch(error){
            console.error("error creating game",error);
            alert("error creating game");
        }finally{
            setUploading(false);
        }

    }

    useEffect(() => {
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        if (storedTeams && teamId) {
            setTeams(storedTeams);
            }
    }, [teamId]);
    return(
        <MainLayout teams={teams}>
            <div className='add-game-container'>
                <form onSubmit={(e)=>{e.preventDefault();handleAddGame();}} className='add-game-form'>
                    <h2>Add Game</h2>
                    <FloatingInput
                        label='Opponent'
                        id='opponent'
                        type='text'
                        value={opponent}
                        onChange={(e)=>setOpponent(e.target.value)}
                    />
                    <input
                        id='date'
                        type='date'
                        value={date}
                        onChange={(e)=>setDate(e.target.value)}
                    />
                    <input
                        id='file'
                        type='file'
                        value={file}
                        onChange={(e)=>setFile(e.target.files[0])}
                    />
                    <ButtonComponent
                        type='submit'
                        disabled={!opponent||!date||!file||uploading}
                    >
                        {uploading? "Creating Game":"Create Game"}
                    </ButtonComponent>
                </form>
            </div>
        </MainLayout>
    )
}

export default AddGame;
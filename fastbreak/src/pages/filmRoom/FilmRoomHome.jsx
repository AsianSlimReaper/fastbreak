import React, {useEffect, useState} from "react";
import "./FilmRoomHome.css"
import {useParams} from "react-router-dom";
import {GetAllGames} from "../../services/filmRoom/games.js";
import MainLayout from "../../components/main/MainLayout.jsx";
import FilmHomeTable from "../../components/filmRoom/FilmHomeTable.jsx";
import Loader from "../../components/universal/Loader.jsx";

function FilmRoomHome(){
    const token = localStorage.getItem("access_token");
    const {teamId} = useParams()

    const [teams, setTeams] = useState([]);
    const [currentMembership,setCurrentMembership] = useState(null);
    const [games,setGames] = useState([]);

    useEffect(() => {
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        if (storedTeams && teamId) {
            setTeams(storedTeams);
            const matched = storedTeams.find(m => m.team.id === teamId);
            if (matched) {
                setCurrentMembership(matched);
            }
        }
    }, [teamId]);

    useEffect(() => {
        const fetchGames = async() =>{
            try{
                const game_details = await GetAllGames(token,teamId);
                setGames(game_details);
            }catch(error){
                console.error("error fetching games",error);
            }
        }
        fetchGames()
    }, [token,teamId]);

    return(
        <>
            <MainLayout teams={teams}>
                <div className='film-home-container'>
                    {games && currentMembership?(
                        <FilmHomeTable teamId={teamId} games={games} role={currentMembership.role}/>
                    ):(
                        <div className='film-home-loader'>
                            <Loader/>
                        </div>
                    )}
                </div>
            </MainLayout>
        </>
    )
}

export default FilmRoomHome
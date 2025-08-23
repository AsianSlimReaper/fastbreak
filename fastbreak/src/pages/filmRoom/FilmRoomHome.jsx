import React, {useEffect, useState} from "react";
import "./FilmRoomHome.css"
import {useParams} from "react-router-dom";
import {GetAllGames} from "../../services/filmRoom/games.js";
import MainLayout from "../../components/main/MainLayout.jsx";
import FilmHomeTable from "../../components/filmRoom/FilmHomeTable.jsx";
import Loader from "../../components/universal/Loader.jsx";

function FilmRoomHome(){
    // Get the token from localStorage
    const token = localStorage.getItem("access_token");
    const {teamId} = useParams()

    // State to hold teams, current membership, and games
    const [teams, setTeams] = useState([]);
    const [currentMembership,setCurrentMembership] = useState(null);
    const [games,setGames] = useState([]);

    // Load teams and current membership from localStorage when component mounts
    useEffect(() => {
        // Get teams from localStorage
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        // Check if teams are stored and if teamId is available
        if (storedTeams && teamId) {
            // Set teams state
            setTeams(storedTeams);
            // Find the current membership based on teamId
            const matched = storedTeams.find(m => m.team.id === teamId);
            // If a match is found, set the current membership
            if (matched) {
                setCurrentMembership(matched);
            }
        }
    }, [teamId]); // run effect when teamId changes

    // Fetch games when the component mounts or when token or teamId changes
    useEffect(() => {
        const fetchGames = async() =>{
            try{
                // get all games for the team using the token and teamId
                const game_details = await GetAllGames(token,teamId);
                // Set the games state with the fetched game details
                setGames(game_details);
            }catch(error){
                // Log any errors that occur during the fetch
                console.error("error fetching games",error);
            }
        }
        // Call the fetchGames function to load games
        fetchGames()
    }, [token,teamId]); // run effect when token or teamId changes

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
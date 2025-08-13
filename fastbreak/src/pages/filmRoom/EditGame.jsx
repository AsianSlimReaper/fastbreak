import React, {useEffect, useState} from "react";
import "./EditGame.css"
import {useNavigate, useParams} from "react-router-dom";
import {GetGameDetails} from "../../services/filmRoom/games.js";
import {GetVideo} from "../../services/filmRoom/wasabi.js";
import MainLayout from "../../components/main/MainLayout.jsx";
import VideoPlayer from "../../components/filmRoom/VideoPlayer.jsx";

function EditGame(){
    const navigate = useNavigate();
    const {teamId,gameId}=useParams();
    const token = localStorage.getItem("access_token");
    const [teams,setTeams] = useState(null);
    const [game,setGame] = useState(null);
    const [videoUrl,setVideoUrl] = useState(null);

    useEffect(() => {
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        if (storedTeams && teamId) {
            setTeams(storedTeams);
            }
    }, [teamId]);

    useEffect(()=>{
        const fetchGameDetails = async()=>{
            if (!token || !gameId) return;
            try{
                const gameDetails = await GetGameDetails(token,gameId);
                setGame(gameDetails);
            }catch(error){
                console.error("error fetching game details",error);
                alert("error fetching game details");
            }
        }
        fetchGameDetails();
    },[token,gameId])

    useEffect(()=>{
        const fetchGameVideo = async() =>{
            if (!token || !gameId) return;
            try{
                const video = await GetVideo(token,gameId);
                setVideoUrl(video.url);
            }catch(error){
                console.error("error fetching game video",error);
                alert("error fetching game video");
            }
        }
        fetchGameVideo();
    },[token,gameId])

    return(
        <MainLayout teams={teams}>
            <VideoPlayer/>
        </MainLayout>
    )
}

export default EditGame
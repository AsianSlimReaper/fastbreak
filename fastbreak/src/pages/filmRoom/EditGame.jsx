import React, {useEffect, useState} from "react";
import "./EditGame.css"
import {useNavigate, useParams} from "react-router-dom";
import {GetGameDetails} from "../../services/filmRoom/games.js";
import {GetVideo} from "../../services/filmRoom/wasabi.js";
import MainLayout from "../../components/main/MainLayout.jsx";
import VideoPlayer from "../../components/filmRoom/VideoPlayer.jsx";
import EditTabContainer from "../../components/filmRoom/EditTabContainer.jsx";
import {GetBasicStats, GetShootingStats} from "../../services/filmRoom/stats.js";
import {GetComments} from "../../services/filmRoom/comment.js";
import {GetSubs} from "../../services/filmRoom/substitution.js";
import Loader from "../../components/universal/Loader.jsx";

function EditGame(){
    const navigate = useNavigate();
    const {teamId,gameId}=useParams();
    const token = localStorage.getItem("access_token");
    const [teams,setTeams] = useState([]);
    const [game,setGame] = useState(null);
    const [videoUrl,setVideoUrl] = useState(null);
    const [basicStats,setBasicStats] = useState(null)
    const [shootingStats,setShootingStats] = useState(null)
    const [comments,setComments] = useState(null)
    const [subs,setSubs] = useState(null)

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

    useEffect(()=>{
        const fetchGameStatsAndAnalysis = async()=>{
            try{
                const basicBoxScore = await GetBasicStats(token,gameId)
                const shootingBoxScore = await GetShootingStats(token,gameId)
                const gameComments = await GetComments(token,gameId)
                const gameSubs = await GetSubs(token,gameId)

                setBasicStats(basicBoxScore)
                setShootingStats(shootingBoxScore)
                setComments(gameComments)
                setSubs(gameSubs)
            }catch(error){
                console.error("error fetching data",error)
                alert("error fetching data")
            }
        }
        fetchGameStatsAndAnalysis()
    },[token,gameId])

    return(
        <MainLayout teams={teams}>
            {!basicStats||!shootingStats||!comments?(
                <Loader/>
            ):(
                <>
                    <VideoPlayer videoUrl={videoUrl}/>
                    <EditTabContainer teamBasicStats={basicStats.team} opponentBasicStats={basicStats.opponent}
                                      teamShootingStats={shootingStats.team}
                                      opponentShootingStats={shootingStats.opponent} comments={{comments}} sub={subs}/>
            </>
    )}
        </MainLayout>
    )
}

export default EditGame
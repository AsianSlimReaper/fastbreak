import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/main/MainLayout.jsx";
import VideoPlayer from "../../components/filmRoom/VideoPlayer.jsx";
import EditTabContainer from "../../components/filmRoom/EditTabContainer.jsx";
import Loader from "../../components/universal/Loader.jsx";
import { GetGameDetails, GetTeamPlayers, GetGameParticipants } from "../../services/filmRoom/games.js";
import { GetVideo } from "../../services/filmRoom/wasabi.js";
import { GetBasicStats, GetShootingStats } from "../../services/filmRoom/stats.js";
import { GetComments } from "../../services/filmRoom/comment.js";
import { GetSubs } from "../../services/filmRoom/substitution.js";
import { GetPlayByPlays } from "../../services/filmRoom/playByPlay.js";
import PlayByPlayTable from "../../components/filmRoom/PlayByPlayTable.jsx";
import "./ViewGame.css";

function ViewGame() {
    const { teamId, gameId } = useParams();
    const token = localStorage.getItem("access_token");
    const [teams, setTeams] = useState([]);
    const [game, setGame] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [basicStats, setBasicStats] = useState(null);
    const [shootingStats, setShootingStats] = useState(null);
    const [comments, setComments] = useState(null);
    const [subs, setSubs] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [starters, setStarters] = useState([]);
    const [bench, setBench] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [videoSeek, setVideoSeek] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [playByPlay, setPlayByPlay] = useState([]);
    const videoRef = useRef();

    useEffect(() => {
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        if (storedTeams && teamId) {
            setTeams(storedTeams);
        }
    }, [teamId]);

    useEffect(() => {
        const fetchGameDetails = async () => {
            if (!token || !gameId) return;
            try {
                const gameDetails = await GetGameDetails(token, gameId);
                setGame(gameDetails);
            } catch (error) {
                console.error("error fetching game details", error);
            }
        };
        fetchGameDetails();
    }, [token, gameId]);

    useEffect(() => {
        const fetchGameVideo = async () => {
            if (!token || !gameId) return;
            try {
                const video = await GetVideo(token, gameId);
                setVideoUrl(video.url);
            } catch (error) {
                console.error("error fetching game video", error);
            }
        };
        fetchGameVideo();
    }, [token, gameId]);

    useEffect(() => {
        const fetchGameStatsAndAnalysis = async () => {
            try {
                const basicBoxScore = await GetBasicStats(token, gameId);
                const shootingBoxScore = await GetShootingStats(token, gameId);
                const gameComments = await GetComments(token, gameId);
                const gameSubs = await GetSubs(token, gameId);
                setBasicStats(basicBoxScore);
                setShootingStats(shootingBoxScore);
                setComments(gameComments);
                setSubs(gameSubs);
            } catch (error) {
                console.error("error fetching data", error);
            }
        };
        fetchGameStatsAndAnalysis();
    }, [token, gameId]);

    useEffect(() => {
        const fetchAllPlayers = async () => {
            if (!token || !teamId) return;
            try {
                const teamPlayers = await GetTeamPlayers(token, teamId);
                setAllPlayers(teamPlayers);
            } catch (error) {
                setAllPlayers([]);
            }
        };
        fetchAllPlayers();
    }, [token, teamId]);

    useEffect(() => {
        const fetchParticipantsAndStarters = async () => {
            if (!token || !gameId || !teamId) return;
            try {
                const teamPlayers = await GetTeamPlayers(token, teamId);
                const gameParticipants = await GetGameParticipants(token, gameId);
                const participantIds = gameParticipants.map(p => String(p.user_id));
                const participantObjs = teamPlayers.filter(p => participantIds.includes(String(p.user_id)));
                let startersList = [];
                if (subs && Array.isArray(subs)) {
                    const startersSub = subs.find(s => s.timestamp_seconds === 0);
                    if (startersSub && startersSub.on_court) {
                        if (typeof startersSub.on_court === "string") {
                            try {
                                startersList = JSON.parse(startersSub.on_court);
                            } catch {
                                startersList = [];
                            }
                        } else if (Array.isArray(startersSub.on_court)) {
                            startersList = startersSub.on_court;
                        }
                    }
                }
                const benchList = participantIds.filter(id => !startersList.map(String).includes(String(id)));
                setParticipants(participantObjs);
                setStarters(startersList);
                setBench(benchList);
            } catch (error) {
                setParticipants([]);
                setStarters([]);
                setBench([]);
            }
        };
        fetchParticipantsAndStarters();
    }, [token, gameId, teamId, subs]);

    useEffect(() => {
        const fetchPlayByPlay = async () => {
            if (!token || !gameId) return;
            try {
                const pbp = await GetPlayByPlays(token, gameId);
                setPlayByPlay(pbp);
            } catch (error) {
                setPlayByPlay([]);
            }
        };
        fetchPlayByPlay();
    }, [token, gameId]);

    // Handler to seek video to a specific time
    const handleSeekVideo = (seconds) => {
        setVideoSeek(seconds);
    };

    // Track current video time for play-by-play highlight
    const [currentVideoTime, setCurrentVideoTime] = useState(0);
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const handleTimeUpdate = () => {
            setCurrentVideoTime(Math.floor(video.currentTime || 0));
        };
        video.addEventListener("timeupdate", handleTimeUpdate);
        return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }, [videoRef, videoUrl]);

    return (
        <MainLayout teams={teams}>
            {!basicStats || !shootingStats || !comments ? (
                <Loader />
            ) : (
                <div className="viewgame-main-layout">
                    <div className="viewgame-left-col">
                        <div className="viewgame-video-wrap">
                            <VideoPlayer videoUrl={videoUrl} seekTo={videoSeek} onSeeked={() => setVideoSeek(null)} ref={videoRef} />
                        </div>
                        <div className="viewgame-pbp-table">
                            <PlayByPlayTable
                                playByPlay={playByPlay}
                                currentTime={currentVideoTime}
                                onPlayClick={handleSeekVideo}
                            />
                        </div>
                    </div>
                    <div className="viewgame-right-col">
                        <EditTabContainer
                            teamBasicStats={basicStats.team}
                            opponentBasicStats={basicStats.opponent}
                            teamShootingStats={shootingStats.team}
                            opponentShootingStats={shootingStats.opponent}
                            comments={{ comments }}
                            sub={subs}
                            participants={participants}
                            starters={starters}
                            bench={bench}
                            onAddPlayer={null}
                            allPlayers={allPlayers}
                            onSeekVideo={handleSeekVideo}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            selectedPlayerId={selectedPlayerId}
                            onPlayerRowClick={null}
                        />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default ViewGame;

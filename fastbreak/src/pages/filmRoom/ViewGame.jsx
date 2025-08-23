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
    // initializing state and refs
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

    // Load teams from localStorage when component mounts or teamId changes
    useEffect(() => {
        // get teams from localStorage
        const storedTeams = JSON.parse(localStorage.getItem("teams"));
        // if teams exist in localStorage and teamId is provided, set teams state
        if (storedTeams && teamId) {
            setTeams(storedTeams);
        }
    }, [teamId]); // run when teamId changes

    // Fetch game details, video, stats, comments, subs, participants, and play-by-play
    useEffect(() => {
        const fetchGameDetails = async () => {
            // Check if token and gameId are available
            if (!token || !gameId) return;
            try {
                // Fetch game details using the provided token and gameId
                const gameDetails = await GetGameDetails(token, gameId);
                // Set the game details in state
                setGame(gameDetails);
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("error fetching game details", error);
            }
        };
        // Call the fetchGameDetails function to load game details
        fetchGameDetails();
    }, [token, gameId]); // run when token or gameId changes

    // Fetch video URL for the game
    useEffect(() => {
        const fetchGameVideo = async () => {
            // Check if token and gameId are available
            if (!token || !gameId) return;
            try {
                // Fetch video URL using the provided token and gameId
                const video = await GetVideo(token, gameId);
                // Set the video URL in state
                setVideoUrl(video.url);
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("error fetching game video", error);
            }
        };
        fetchGameVideo(); // Call the fetchGameVideo function to load video URL
    }, [token, gameId]); // run when token or gameId changes

    // Fetch game stats and analysis (basic stats, shooting stats, comments, subs)
    useEffect(() => {
        const fetchGameStatsAndAnalysis = async () => {
            try {
                // get box score, shooting stats, comments, and subs
                const basicBoxScore = await GetBasicStats(token, gameId);
                const shootingBoxScore = await GetShootingStats(token, gameId);
                const gameComments = await GetComments(token, gameId);
                const gameSubs = await GetSubs(token, gameId);
                // set the fetched data in state
                setBasicStats(basicBoxScore);
                setShootingStats(shootingBoxScore);
                setComments(gameComments);
                setSubs(gameSubs);
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("error fetching data", error);
            }
        };
        // Call the fetchGameStatsAndAnalysis function to load stats and analysis
        fetchGameStatsAndAnalysis();
    }, [token, gameId]); // run when token or gameId changes

    // Fetch all players for the team
    useEffect(() => {
        // Function to fetch all players for the team
        const fetchAllPlayers = async () => {
            // Check if token and teamId are available
            if (!token || !teamId) return;
            try {
                // Fetch team players using the provided token and teamId
                const teamPlayers = await GetTeamPlayers(token, teamId);
                // Set the fetched players in state
                setAllPlayers(teamPlayers);
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("error fetching team players", error);
                setAllPlayers([]);
            }
        };
        // Call the fetchAllPlayers function to load players
        fetchAllPlayers();
    }, [token, teamId]); // run when token or teamId changes

    // Fetch participants and starters for the game
    useEffect(() => {
        const fetchParticipantsAndStarters = async () => {
            // Check if token, gameId, and teamId are available
            if (!token || !gameId || !teamId) return;
            try {
                // Fetch team players and game participants
                const teamPlayers = await GetTeamPlayers(token, teamId);
                const gameParticipants = await GetGameParticipants(token, gameId);
                // Filter participants to get only those who played in the game
                const participantIds = gameParticipants.map(p => String(p.user_id));
                const participantObjs = teamPlayers.filter(p => participantIds.includes(String(p.user_id)));
                // Set participants based on the filtered team players
                let startersList = [];
                // Check if subs data is available and parse starters from it
                if (subs && Array.isArray(subs)) {
                    // Find the starters sub which has timestamp_seconds of 0
                    const startersSub = subs.find(s => s.timestamp_seconds === 0);
                    // If found, parse the on_court data to get starters
                    if (startersSub && startersSub.on_court) {
                        // Check if on_court is a string or an array and parse accordingly
                        if (typeof startersSub.on_court === "string") {
                            try {
                                // Attempt to parse the JSON string
                                startersList = JSON.parse(startersSub.on_court);
                            } catch {
                                // If parsing fails, set startersList to an empty array
                                startersList = [];
                            }
                        } else if (Array.isArray(startersSub.on_court)) {
                            // If it's already an array, use it directly
                            startersList = startersSub.on_court;
                        }
                    }
                }
                // Filter participants to get bench players
                const benchList = participantIds.filter(id => !startersList.map(String).includes(String(id)));
                // Set the state with participants, starters, and bench players
                setParticipants(participantObjs);
                setStarters(startersList);
                setBench(benchList);
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("error fetching participants and starters", error);
                setParticipants([]);
                setStarters([]);
                setBench([]);
            }
        };
        // Call the fetchParticipantsAndStarters function to load participants and starters
        fetchParticipantsAndStarters();
    }, [token, gameId, teamId, subs]); // run when token, gameId, teamId, or subs change

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

    // Effect to update current video time when the video plays
    useEffect(() => {
        // Ensure videoRef is defined and current
        const video = videoRef.current;
        // If video is not available, return early
        if (!video) return;
        // Add event listener to update current video time
        const handleTimeUpdate = () => {
            // Set the current video time in seconds, defaulting to 0 if currentTime is not available
            setCurrentVideoTime(Math.floor(video.currentTime || 0));
        };
        // Add timeupdate event listener to the video element
        video.addEventListener("timeupdate", handleTimeUpdate);
        // Cleanup function to remove the event listener when the component unmounts
        return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }, [videoRef, videoUrl]); // run when videoRef or videoUrl changes

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

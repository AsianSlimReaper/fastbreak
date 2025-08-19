import React, {useEffect, useState, useRef} from "react";
import "./EditGame.css"
import {useNavigate, useParams} from "react-router-dom";
import {GetGameDetails, GetTeamPlayers, GetGameParticipants, CreateGameParticipant, CreateBoxScore} from "../../services/filmRoom/games.js";
import {GetVideo} from "../../services/filmRoom/wasabi.js";
import MainLayout from "../../components/main/MainLayout.jsx";
import VideoPlayer from "../../components/filmRoom/VideoPlayer.jsx";
import EditTabContainer from "../../components/filmRoom/EditTabContainer.jsx";
import {GetBasicStats, GetShootingStats} from "../../services/filmRoom/stats.js";
import {CreateComment, GetComments} from "../../services/filmRoom/comment.js";
import {CreateSubs, GetSubs} from "../../services/filmRoom/substitution.js";
import Loader from "../../components/universal/Loader.jsx";
import AddStat from "../../components/filmRoom/AddStat.jsx";
import AddAnalysis from "../../components/filmRoom/AddAnalysis.jsx";
import { CreatePlayByPlays } from "../../services/filmRoom/playByPlay.js";
import {UpdateBoxScore} from "../../services/filmRoom/boxScore.js";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";

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
    const [participants, setParticipants] = useState([]);
    const [starters, setStarters] = useState([]);
    const [bench, setBench] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [videoSeek, setVideoSeek] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [subMode, setSubMode] = useState(false);
    const [subOutPlayerId, setSubOutPlayerId] = useState(null);
    const [isOpponentSelected, setIsOpponentSelected] = useState(false);
    const videoRef = useRef();

    const [commentsList, setCommentsList] = useState([])
    const [playByPlayList, setPlayByPlayList] = useState([])
    const [subsList,setSubsList] = useState([])

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

    // Fetch all team players for modal
    useEffect(() => {
        const fetchAllPlayers = async () => {
            if (!token || !teamId) return;
            try {
                const teamPlayers = await GetTeamPlayers(token, teamId);
                setAllPlayers(teamPlayers);
            } catch (error) {
                console.error("Error fetching team players:", error);
                setAllPlayers([]);
            }
        };
        fetchAllPlayers();
    }, [token, teamId]);

    // Fetch participants and starters/bench
    useEffect(() => {
        const fetchParticipantsAndStarters = async () => {
            if (!token || !gameId || !teamId) return;
            try {
                const teamPlayers = await GetTeamPlayers(token, teamId);
                const gameParticipants = await GetGameParticipants(token, gameId);
                const participantIds = gameParticipants.map(p => String(p.user_id));
                const participantObjs = teamPlayers.filter(p => participantIds.includes(String(p.user_id)));

                // Get starters from subs (timestamp_seconds === 0)
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
                // Bench = participants - starters
                const benchList = participantIds.filter(id => !startersList.map(String).includes(String(id)));

                setParticipants(participantObjs);
                setStarters(startersList);
                setBench(benchList);
            } catch (error) {
                console.error("Error fetching participants or starters:", error);
                setParticipants([]);
                setStarters([]);
                setBench([]);
            }
        };
        fetchParticipantsAndStarters();
    }, [token, gameId, teamId, subs]);


    // Handler to add new play-by-play entries and update state
    const handleAddPlayByPlays = async (newPlayByPlays) => {
        setPlayByPlayList(prev => [...prev, ...newPlayByPlays]);
        console.log(playByPlayList);
    }
    // Handler to add a player (participant) to the game
    const handleAddPlayer = async ({ name, user_id }) => {
        if (!token || !gameId || !user_id) return;
        try {
            // Call backend to add participant
            await CreateGameParticipant(token, { game_id: gameId, user_id });

            // Call backend to create box score for this participant
            await CreateBoxScore(token, {
                game_id: gameId,
                user_id:user_id,
                team_id: teamId,
                is_opponent: false,
                ast: 0,
                oreb: 0,
                dreb: 0,
                stl: 0,
                blk: 0,
                tov: 0,
                fls: 0,
                plus_minus: 0,
                twopm: 0,
                twopa: 0,
                threepm: 0,
                threepa: 0,
                ftm: 0,
                fta: 0,
            });

            // Add to participants state (optimistic update)
            setParticipants(prev => [...prev, { name, user_id }]);
            // Also update bench if not already in starters
            setBench(prev => [...prev, user_id]);

            // Add default stats for this player to basicStats and shootingStats
            setBasicStats(prev => {
                if (!prev) return prev;
                // Avoid duplicate
                if (prev.team.some(p => String(p.user_id) === String(user_id))) return prev;
                return {
                    ...prev,
                    team: [
                        ...prev.team,
                        {
                            user_id,
                            name,
                            pts: 0,
                            ast: 0,
                            reb: 0,
                            oreb: 0,
                            dreb: 0,
                            stl: 0,
                            blk: 0,
                            tov: 0,
                            fls: 0,
                            eff: 0,
                            plus_minus: 0
                        }
                    ]
                };
            });
            setShootingStats(prev => {
                if (!prev) return prev;
                // Avoid duplicate
                if (prev.team.some(p => String(p.user_id) === String(user_id))) return prev;
                return {
                    ...prev,
                    team: [
                        ...prev.team,
                        {
                            user_id,
                            name,
                            fgm: 0,
                            fga: 0,
                            fg_pct: 0,
                            threepm: 0,
                            threepa: 0,
                            threep_pct: 0,
                            ftm: 0,
                            fta: 0,
                            ft_pct: 0,
                            efg_pct: 0,
                            ts_pct: 0
                        }
                    ]
                };
            });
        } catch (error) {
            console.error("Failed to add player", error);
            alert("Failed to add player. Make sure the user ID is valid.");
        }
    };

    // Handler to seek video to a specific time
    const handleSeekVideo = (seconds) => {
        setVideoSeek(seconds);
    };

    // Helper to get player object by user_id
    const getPlayerById = (user_id) => participants.find(p => String(p.user_id) === String(user_id));

    // Handler for selecting opponent
    const handleSelectOpponent = () => {
        setIsOpponentSelected(prev => !prev);
        setSelectedPlayerId(null);
    };

    // Helper to recalculate efficiency and plus_minus for a player or opponent
    function recalcEffAndPlusMinus(box) {
        // Calculate points
        const pts = (box.twopm || 0) * 2 + (box.threepm || 0) * 3 + (box.ftm || 0);
        // Calculate rebounds
        const reb = (box.oreb || 0) + (box.dreb || 0);
        // Calculate efficiency (EFF)
        const fgm = (box.twopm || 0) + (box.threepm || 0);
        const fga = (box.twopa || 0) + (box.threepa || 0);
        const eff = (pts + reb + (box.ast || 0) + (box.stl || 0) + (box.blk || 0)) - ((fga - fgm) + ((box.fta || 0) - (box.ftm || 0)) + (box.tov || 0));
        return { eff, plus_minus: box.plus_minus || 0 };
    }

    // Handler for stat button click
    const handleAddStat = (statType, playerObj) => {
        if (statType === "substitution") {
            if (!playerObj) return;
            setSubMode(true);
            setSubOutPlayerId(playerObj.user_id);
            return;
        }
        if (!playerObj) return;
        // Plus-minus logic
        let plusMinusDelta = 0;
        if (statType === "2p_make") plusMinusDelta = 2;
        if (statType === "3p_make") plusMinusDelta = 3;
        if (statType === "ft_make") plusMinusDelta = 1;
        // Add play-by-play entry for stat (not substitution)
        const pbpDescription = playerObj.is_opponent
            ? `Opponent: ${statType.replace(/_/g, ' ')}`
            : `${playerObj.name}: ${statType.replace(/_/g, ' ')}`;

        const pbpEvent = {
            user_id: playerObj.is_opponent ? null : playerObj.user_id,
            game_id: gameId,
            timestamp_seconds: videoRef.current && typeof videoRef.current.currentTime === "number" ? Math.floor(videoRef.current.currentTime) : 0,
            is_opponent: !!playerObj.is_opponent,
            event_type: statType,
            description: pbpDescription
        };
        handleAddPlayByPlays([pbpEvent]);

        // If opponent is selected, update opponent stats and decrement team on-court plus-minus
        if (playerObj.is_opponent) {
            setBasicStats(prev => {
                if (!prev) return prev;
                // Decrement all on-court team players' plus-minus
                const updatedTeam = prev.team.map(p => {
                    let box = { ...p };
                    if (starters.map(String).includes(String(p.user_id)) && plusMinusDelta !== 0) {
                        box.plus_minus = (box.plus_minus || 0) - plusMinusDelta;
                    }
                    const { eff, plus_minus } = recalcEffAndPlusMinus(box, statType);
                    return { ...box, eff, plus_minus };
                });
                return {
                    ...prev,
                    team: updatedTeam,
                    opponent: prev.opponent.map(p => {
                        if (p.user_id === null) {
                            let box = { ...p };
                            if (statType === "2p_make") { box.pts = (box.pts || 0) + 2; box.twopm = (box.twopm || 0) + 1; box.twopa = (box.twopa || 0) + 1; }
                            if (statType === "2p_miss") { box.twopa = (box.twopa || 0) + 1; }
                            if (statType === "3p_make") { box.pts = (box.pts || 0) + 3; box.threepm = (box.threepm || 0) + 1; box.threepa = (box.threepa || 0) + 1; }
                            if (statType === "3p_miss") { box.threepa = (box.threepa || 0) + 1; }
                            if (statType === "ft_make") { box.pts = (box.pts || 0) + 1; box.ftm = (box.ftm || 0) + 1; box.fta = (box.fta || 0) + 1; }
                            if (statType === "ft_miss") { box.fta = (box.fta || 0) + 1; }
                            if (statType === "oreb") { box.oreb = (box.oreb || 0) + 1; }
                            if (statType === "dreb") { box.dreb = (box.dreb || 0) + 1; }
                            if (statType === "ast") { box.ast = (box.ast || 0) + 1; }
                            if (statType === "tov") { box.tov = (box.tov || 0) + 1; }
                            if (statType === "stl") { box.stl = (box.stl || 0) + 1; }
                            if (statType === "blk") { box.blk = (box.blk || 0) + 1; }
                            if (statType === "fls") { box.fls = (box.fls || 0) + 1; }
                            // Increment opponent plus-minus
                            box.plus_minus = (box.plus_minus || 0) + plusMinusDelta;
                            const { eff } = recalcEffAndPlusMinus(box, statType);
                            return { ...box, eff };
                        }
                        const { eff, plus_minus } = recalcEffAndPlusMinus(p, statType);
                        return { ...p, eff, plus_minus };
                    })
                };
            });
            setShootingStats(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    opponent: prev.opponent.map(p =>
                        p.user_id === null
                            ? {
                                ...p,
                                fgm: (["2p_make", "3p_make"].includes(statType)) ? (p.fgm || 0) + 1 : p.fgm || 0,
                                fga: (["2p_make", "2p_miss", "3p_make", "3p_miss"].includes(statType)) ? (p.fga || 0) + 1 : p.fga || 0,
                                threepm: statType === "3p_make" ? (p.threepm || 0) + 1 : p.threepm || 0,
                                threepa: (["3p_make", "3p_miss"].includes(statType)) ? (p.threepa || 0) + 1 : p.threepa || 0,
                                ftm: statType === "ft_make" ? (p.ftm || 0) + 1 : p.ftm || 0,
                                fta: (["ft_make", "ft_miss"].includes(statType)) ? (p.fta || 0) + 1 : p.fta || 0,
                            }
                            : p
                    )
                };
            });
            return;
        }
        // Team stat update: increment all on-court players' plus-minus if scoring
        setBasicStats(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                team: prev.team.map(p => {
                    let box = { ...p };
                    if (String(p.user_id) === String(playerObj.user_id)) {
                        if (statType === "2p_make") { box.pts = (box.pts || 0) + 2; box.twopm = (box.twopm || 0) + 1; box.twopa = (box.twopa || 0) + 1; }
                        if (statType === "2p_miss") { box.twopa = (box.twopa || 0) + 1; }
                        if (statType === "3p_make") { box.pts = (box.pts || 0) + 3; box.threepm = (box.threepm || 0) + 1; box.threepa = (box.threepa || 0) + 1; }
                        if (statType === "3p_miss") { box.threepa = (box.threepa || 0) + 1; }
                        if (statType === "ft_make") { box.pts = (box.pts || 0) + 1; box.ftm = (box.ftm || 0) + 1; box.fta = (box.fta || 0) + 1; }
                        if (statType === "ft_miss") { box.fta = (box.fta || 0) + 1; }
                        if (statType === "oreb") { box.oreb = (box.oreb || 0) + 1; }
                        if (statType === "dreb") { box.dreb = (box.dreb || 0) + 1; }
                        if (statType === "ast") { box.ast = (box.ast || 0) + 1; }
                        if (statType === "tov") { box.tov = (box.tov || 0) + 1; }
                        if (statType === "stl") { box.stl = (box.stl || 0) + 1; }
                        if (statType === "blk") { box.blk = (box.blk || 0) + 1; }
                        if (statType === "fls") { box.fls = (box.fls || 0) + 1; }
                    }
                    // If this player is on court and it's a scoring play, update plus-minus
                    if (starters.map(String).includes(String(p.user_id)) && plusMinusDelta !== 0) {
                        box.plus_minus = (box.plus_minus || 0) + plusMinusDelta;
                    }
                    const { eff, plus_minus } = recalcEffAndPlusMinus(box, statType);
                    return { ...box, eff, plus_minus };
                }),
                opponent: prev.opponent.map(p => {
                    // Decrement opponent plus-minus when team scores
                    if (p.user_id === null && plusMinusDelta !== 0) {
                        let box = { ...p };
                        box.plus_minus = (box.plus_minus || 0) - plusMinusDelta;
                        const { eff } = recalcEffAndPlusMinus(box, statType);
                        return { ...box, eff };
                    }
                    const { eff, plus_minus } = recalcEffAndPlusMinus(p, statType);
                    return { ...p, eff, plus_minus };
                })
            };
        });
        setShootingStats(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                team: prev.team.map(p =>
                    String(p.user_id) === String(playerObj.user_id)
                        ? {
                            ...p,
                            fgm: (["2p_make", "3p_make"].includes(statType)) ? (p.fgm || 0) + 1 : p.fgm || 0,
                            fga: (["2p_make", "2p_miss", "3p_make", "3p_miss"].includes(statType)) ? (p.fga || 0) + 1 : p.fga || 0,
                            threepm: statType === "3p_make" ? (p.threepm || 0) + 1 : p.threepm || 0,
                            threepa: (["3p_make", "3p_miss"].includes(statType)) ? (p.threepa || 0) + 1 : p.threepa || 0,
                            ftm: statType === "ft_make" ? (p.ftm || 0) + 1 : p.ftm || 0,
                            fta: (["ft_make", "ft_miss"].includes(statType)) ? (p.fta || 0) + 1 : p.fta || 0,
                        }
                        : p
                )
            };
        });
    };

    // Handler for row click in stats table
    const handlePlayerRowClick = (user_id) => {
        if (subMode) {
            // Determine if subOutPlayerId is on court or on bench
            const isSubOutOnCourt = starters.map(String).includes(String(subOutPlayerId));
            const isClickedOnCourt = starters.map(String).includes(String(user_id));
            // Only swap if clicking a player from the opposite group
            if (
                (isSubOutOnCourt && bench.map(String).includes(String(user_id))) ||
                (!isSubOutOnCourt && starters.map(String).includes(String(user_id)))
            ) {
                // Compute new starters after swap
                const newStarters = isSubOutOnCourt
                    ? starters.map(id => String(id) === String(subOutPlayerId) ? user_id : id)
                    : starters.map(id => String(id) === String(user_id) ? subOutPlayerId : id);
                setStarters(newStarters);
                setBench(prev =>
                    isSubOutOnCourt
                        ? prev.map(id => String(id) === String(user_id) ? subOutPlayerId : id)
                        : prev.map(id => String(id) === String(subOutPlayerId) ? user_id : id)
                );
                setSelectedPlayerId(isSubOutOnCourt ? user_id : subOutPlayerId); // highlight the new on-court player
                setSubMode(false);
                setSubOutPlayerId(null);
                // Add to subsList
                setSubsList(prev => [
                    ...prev,
                    {
                        game_id: gameId,
                        timestamp_seconds: videoRef.current && typeof videoRef.current.currentTime === "number" ? Math.floor(videoRef.current.currentTime) : 0,
                        on_court: newStarters.map(String)
                    }
                ]);
            }
            return;
        }
        setSelectedPlayerId(user_id);
    };

    // Handler for adding a comment
    const handleAddComment = async (commentText, timestamp) => {
        // Add the new comment to the local comments state for immediate UI update
        setComments(prev => [
            ...(Array.isArray(prev) ? prev : []),
            {
                comment_text: commentText,
                timestamp_seconds: timestamp,
            }
        ]);

        setCommentsList(prev => [...prev, {
            comment_text: commentText,
            timestamp_seconds: Math.round(timestamp),
            game_id: gameId,}]);

        console.log(commentsList)
    };

    const getTableData = () => {
        if (!basicStats || !shootingStats) return [];
        // Map user_id to shooting stats for quick lookup
        const shootingMap = (shootingStats.team || []).reduce((acc, s) => {
            acc[String(s.user_id)] = s;
            return acc;
        }, {});
        // Combine basic and shooting stats for each player
        const teamData = (basicStats.team || []).map((p) => {
            const shooting = shootingMap[String(p.user_id)] || {};
            return {
                user_id: p.user_id,
                name: p.name,
                ast: p.ast || 0,
                oreb: p.oreb || 0,
                dreb: p.dreb || 0,
                stl: p.stl || 0,
                blk: p.blk || 0,
                tov: p.tov || 0,
                fls: p.fls || 0,
                plus_minus: p.plus_minus || 0,
                // Shooting stats
                twopm: shooting.fgm - shooting.threepm || 0,
                twopa: shooting.fga - shooting.threepa || 0,
                fg_pct: shooting.fg_pct || 0,
                threepm: shooting.threepm || 0,
                threepa: shooting.threepa || 0,
                ftm: shooting.ftm || 0,
                fta: shooting.fta || 0,
                is_opponent: false
            };
        });
        // Add opponent box score as another item in the array
        let opponentData = [];
        if (basicStats.opponent && basicStats.opponent.length > 0) {
            const opp = basicStats.opponent[0];
            const oppShooting = (shootingStats.opponent && shootingStats.opponent[0]) || {};
            opponentData.push({
                user_id: null,
                name: opp.name,
                ast: opp.ast || 0,
                oreb: opp.oreb || 0,
                dreb: opp.dreb || 0,
                stl: opp.stl || 0,
                blk: opp.blk || 0,
                tov: opp.tov || 0,
                fls: opp.fls || 0,
                plus_minus: opp.plus_minus || 0,
                twopm: oppShooting.fgm - oppShooting.threepm || 0,
                twopa: oppShooting.fga - oppShooting.threepa || 0,
                fg_pct: oppShooting.fg_pct || 0,
                threepm: oppShooting.threepm || 0,
                threepa: oppShooting.threepa || 0,
                ftm: oppShooting.ftm || 0,
                fta: oppShooting.fta || 0,
                is_opponent: true
            });
        }
        return [...teamData, ...opponentData];
    }

    const handleSaveData = async() =>{
        if (!token || !gameId) return;
        try {
            const StatsData = getTableData();
            // Only update box scores if there is data
            if (StatsData && StatsData.length > 0) {
                const statsResponse = await UpdateBoxScore(token, gameId, StatsData);
                console.log(statsResponse);
            }
            // Only send play by plays if there are new ones
            if (playByPlayList && playByPlayList.length > 0) {
                const pbpResponse = await CreatePlayByPlays(token, playByPlayList);
                console.log(pbpResponse);
            }
            // Only send comments if there are new ones
            if (commentsList && commentsList.length > 0) {
                console.log(commentsList)
                const commentsResponse = await CreateComment(token, commentsList);
                console.log(commentsResponse);
            }
            // Only send subs if there are new ones
            if (subsList && subsList.length > 0) {
                const subsResponse = await CreateSubs(token, subsList);
                console.log(subsResponse);
            }
            setPlayByPlayList([])
            setSubsList([])
            setCommentsList([])
            alert("Data saved successfully!");

            navigate(`/film-room/team/${teamId}`)
        } catch (error) {
            console.error("Failed to save data", error);
            alert("Failed to save data");
        }
    }

    // Helper to get current on-court players based on subs and current video time
    const getCurrentOnCourt = (currentTime) => {
        if (!subs || !Array.isArray(subs) || subs.length === 0) return starters;
        // Sort subs by timestamp_seconds ascending
        const sortedSubs = [...subs].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);
        // Find the latest sub at or before currentTime
        let lastSub = sortedSubs[0];
        for (let i = 0; i < sortedSubs.length; i++) {
            if (sortedSubs[i].timestamp_seconds <= currentTime) {
                lastSub = sortedSubs[i];
            } else {
                break;
            }
        }
        // on_court may be stringified JSON or array
        let onCourt;
        if (typeof lastSub.on_court === 'string') {
            try {
                onCourt = JSON.parse(lastSub.on_court);
            } catch {
                onCourt = [];
            }
        } else {
            onCourt = lastSub.on_court;
        }
        return onCourt || [];
    };

    // Update starters when video time changes
    useEffect(() => {
        if (!videoRef.current || !subs) return;
        const handleTimeUpdate = () => {
            const currentTime = Math.floor(videoRef.current.currentTime || 0);
            const onCourt = getCurrentOnCourt(currentTime);
            setStarters(onCourt);
            // Update bench as well
            const participantIds = participants.map(p => String(p.user_id));
            setBench(participantIds.filter(id => !onCourt.map(String).includes(String(id))));
        };
        const video = videoRef.current;
        if (video && video.addEventListener) {
            video.addEventListener('timeupdate', handleTimeUpdate);
            return () => video.removeEventListener('timeupdate', handleTimeUpdate);
        }
    }, [videoRef, subs, participants]);

    return(
        <MainLayout teams={teams}>
            {!basicStats||!shootingStats||!comments?(
                <Loader/>
            ):(
                <div className="editgame-main-layout">
                    <div className="editgame-left-col">
                        <div className="editgame-video-wrap">
                            <VideoPlayer videoUrl={videoUrl} seekTo={videoSeek} onSeeked={() => setVideoSeek(null)} ref={videoRef} />
                        </div>
                        <div className="editgame-tab-actions">
                            {(activeTab === 0|| activeTab === 1) && (
                                <>
                                    <AddStat
                                        selectedPlayer={isOpponentSelected ? null : getPlayerById(selectedPlayerId)}
                                        onAddStat={handleAddStat}
                                        starters={starters}
                                        bench={bench}
                                        allowOpponent={true}
                                        onSelectOpponent={handleSelectOpponent}
                                        isOpponentSelected={isOpponentSelected}
                                    />
                                    {subMode && (
                                        <div style={{color: "#d32f2f", fontWeight: 500, marginBottom: 8}}>
                                            Click a player {starters.map(String).includes(String(subOutPlayerId)) ? "on the bench" : "on court"} to substitute with <b>{getPlayerById(subOutPlayerId)?.name}</b>
                                        </div>
                                    )}
                                </>
                            )}
                            {activeTab === 2 && (
                                <AddAnalysis
                                    onAddComment={handleAddComment}
                                    currentTime={() =>
                                        videoRef.current && typeof videoRef.current.currentTime === "number"
                                            ? videoRef.current.currentTime
                                            : 0
                                    }
                                />
                            )}
                        </div>
                        <ButtonComponent onClick={handleSaveData}>Save and Exit</ButtonComponent>
                    </div>
                    <div className="editgame-right-col">
                        <EditTabContainer
                            teamBasicStats={basicStats.team}
                            opponentBasicStats={basicStats.opponent}
                            teamShootingStats={shootingStats.team}
                            opponentShootingStats={shootingStats.opponent}
                            comments={{comments}}
                            sub={subs}
                            participants={participants}
                            starters={starters}
                            bench={bench}
                            onAddPlayer={handleAddPlayer}
                            allPlayers={allPlayers}
                            onSeekVideo={handleSeekVideo}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            selectedPlayerId={selectedPlayerId}
                            onPlayerRowClick={handlePlayerRowClick}
                        />
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

export default EditGame

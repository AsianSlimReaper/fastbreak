import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import MainNav from "../../components/main/MainNav.jsx";
import FloatingInput from "../../components/universal/FloatingInput.jsx";
import {CreateTeam, JoinTeam} from "../../services/teamsAPI.js";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";
import './AddTeam.css';

function AddTeam() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);

    const [teamName, setTeamName] = useState('');
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [position, setPosition] = useState('');
    const [teamId, setTeamId] = useState('');

    const handleCreateTeam = async () => {
        if (!teamName.trim()) {
            alert("Please enter a team name.");
            return;
        }

        try {
            const new_team = await CreateTeam(teamName, token);
            const new_membership = await JoinTeam(new_team.id, user.id, 'coach', token);

            const updatedTeams = [...teams, new_membership];
            setTeams(updatedTeams);
            setCurrentTeam(new_membership.team);

            localStorage.setItem('teams', JSON.stringify(updatedTeams));

            setTeamName('');
            navigate('/teams');
        } catch (error) {
            console.error("Error creating team:", error);
            alert("Failed to create team. Please try again.");
        }
    };

    const handleJoinTeam = async () => {
        if (!teamId.trim()) {
            alert("Please enter a team ID.");
            return;
        }

        try {
            const new_membership = await JoinTeam(teamId, user.id, 'player', position, jerseyNumber, token);
            const updatedTeams = [...teams, new_membership];
            setTeams(updatedTeams);
            setCurrentTeam(new_membership.team);

            localStorage.setItem('teams', JSON.stringify(updatedTeams));

            setTeamId('');
            setPosition('');
            setJerseyNumber('');
            navigate('/teams/');
        } catch (error) {
            console.error("Error joining team:", error);
            alert("Failed to join team. Please check the Team ID and try again.");
        }
    };

    useEffect(() => {
        async function fetchUserAndTeams() {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);

                const teamMembershipsData = JSON.parse(localStorage.getItem('teams')) || [];
                setTeams(teamMembershipsData);
            } catch (error) {
                console.error("Failed to fetch user or teams:", error);
            }
        }
        fetchUserAndTeams();
    }, [token]);

    return (
        <main>
            <MainNav teams={teams} setCurrentTeam={setCurrentTeam} />
            <div className='add-team-forms'>
                <form onSubmit={(e) => { e.preventDefault(); handleJoinTeam(); }} className='join-team-form'>
                    <h2>Join Team</h2>
                    <FloatingInput
                        label='Team Id'
                        id='teamId'
                        type='text'
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                    />
                    <FloatingInput
                        label='Position'
                        id='position'
                        type='text'
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                    <FloatingInput
                        label='Jersey Number'
                        id='jerseyNumber'
                        type='number'
                        value={jerseyNumber}
                        onChange={(e) => setJerseyNumber(e.target.value)}
                    />
                    <div className='add-team-button-wrapper'>
                        <ButtonComponent type='submit'>Join Team</ButtonComponent>
                    </div>
                </form>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateTeam(); }} className='create-team-form'>
                    <h2>Create Team</h2>
                    <FloatingInput
                        label='Team Name'
                        id='teamName'
                        type='text'
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                    <div className='add-team-button-wrapper'>
                        <ButtonComponent type='submit'>Create Team</ButtonComponent>
                    </div>
                </form>
                </div>
        </main>
    );
}

export default AddTeam;

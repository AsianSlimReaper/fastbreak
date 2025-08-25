import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "../../components/main/MainNav.jsx";
import FloatingInput from "../../components/universal/FloatingInput.jsx";
import { CreateTeam, JoinTeam } from "../../services/teamsAPI.js";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";
import './AddTeam.css';

function AddTeam() {
    //initializing navigate, token, user, teams, currentTeam, teamName, jerseyNumber, position, teamId, creatingTeam, joiningTeam
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);
    const [currentTeam,setCurrentTeam] = useState(null)

    const [teamName, setTeamName] = useState('');
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [position, setPosition] = useState('');
    const [teamId, setTeamId] = useState('');

    const [creatingTeam, setCreatingTeam] = useState(false);
    const [joiningTeam, setJoiningTeam] = useState(false);

    // Function to handle team creation
    const handleCreateTeam = async () => {
        // Validate team name
        if (!teamName.trim()) {
            // Check if team name is empty
            alert("Please enter a team name.");
            return;
        }

        // Check if user is authenticated
        if (!user || !token) {
            // If user is not authenticated, show an alert
            alert("User not authenticated.");
            return;
        }

        // Set creatingTeam to true to indicate that the team creation process has started
        setCreatingTeam(true);
        try {
            // Call CreateTeam API to create a new team
            const new_team = await CreateTeam(teamName, token);
            // call JoinTeam API to add the user as a coach to the newly created team
            const new_membership = await JoinTeam(new_team.id, user.id, 'coach', null,null,token);

            // Update the teams state with the new membership
            const updatedTeams = [...teams, new_membership];
            // Set the updated teams and current team
            setTeams(updatedTeams);
            setCurrentTeam(new_membership.team);

            // Store the updated teams in localStorage
            localStorage.setItem('teams', JSON.stringify(updatedTeams));

            // Reset the teamName state to clear the input field
            setTeamName('');
            navigate('/teams');
        } catch (error) {
            // If an error occurs during team creation, log the error and show an alert
            console.error("Error creating team:", error);
            alert("Failed to create team. Please try again.");
        } finally {
            // Set creatingTeam to false to indicate that the team creation process has ended
            setCreatingTeam(false);
        }
    };

    const handleJoinTeam = async () => {
        // Validate team ID
        if (!teamId.trim()) {
            alert("Please enter a team ID.");
            return;
        }

        // Validate if user is authenticated
        if (!user || !token) {
            alert("User not authenticated.");
            return;
        }

        // Validate position and jersey number
        setJoiningTeam(true);
        try {
            // Call JoinTeam API to join the team with the provided teamId, user id, position, and jersey number
            const new_membership = await JoinTeam(teamId, user.id, 'player', position, jerseyNumber, token);
            const updatedTeams = [...teams, new_membership];
            // Update the teams state with the new membership
            setTeams(updatedTeams);
            setCurrentTeam(new_membership.team);

            // Store the updated teams in localStorage
            localStorage.setItem('teams', JSON.stringify(updatedTeams));

            // Reset the input fields after successful team join
            setTeamId('');
            setPosition('');
            setJerseyNumber('');
            navigate('/teams/');
        } catch (error) {
            // If an error occurs during team joining, log the error and show an alert
            console.error("Error joining team:", error);
            alert("Failed to join team. Please check the Team ID and try again.");
        } finally {
            // Set joiningTeam to false to indicate that the team joining process has ended
            setJoiningTeam(false);
        }
    };

    // Fetch user and teams from localStorage on component mount
    useEffect(() => {
        try {
            // Retrieve user data from localStorage and parse it
            const userData = JSON.parse(localStorage.getItem('user'));
            // If user data exists, set it to the user state
            if (userData) setUser(userData);

            // Retrieve team memberships from localStorage and parse it
            const teamMembershipsData = JSON.parse(localStorage.getItem('teams')) || [];
            // If team memberships exist, set them to the teams state
            setTeams(teamMembershipsData);
        } catch (error) {
            // If an error occurs while fetching user or teams, log the error
            console.error("Failed to fetch user or teams:", error);
        }
    }, []); // run only once on component mount

    return (
        <main>
            <MainNav teams={teams}/>
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
                        label='Jersey Number'
                        id='jerseyNumber'
                        type='number'
                        min={0}
                        max={99}
                        step={1}
                        value={jerseyNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Only allow integers between 0 and 99, no decimals
                            if (/^\d{0,2}$/.test(value) && (value === '' || (Number(value) >= 0 && Number(value) <= 99))) {
                                setJerseyNumber(value);
                            }
                        }}
                    />
                    <div className="add-team-select-position">
                        <label htmlFor="position">Position</label>
                        <select
                            id="position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select position</option>
                            <option value="guard">Guard</option>
                            <option value="forward">Forward</option>
                            <option value="big">Big</option>
                        </select>
                    </div>
                    <div className='add-team-button-wrapper'>
                        <ButtonComponent
                            type='submit'
                            disabled={!teamId || !position || !jerseyNumber || joiningTeam}
                        >
                            {joiningTeam ? "Joining..." : "Join Team"}
                        </ButtonComponent>
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
                        <ButtonComponent
                            type='submit'
                            disabled={!teamName || creatingTeam}
                        >
                            {creatingTeam ? "Creating..." : "Create Team"}
                        </ButtonComponent>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default AddTeam;

import React,{useState, useEffect} from "react";
import {GetTeamMemberships} from "../../services/teamsAPI.js";
import {GetUser} from "../../services/userApi.js";
import MainNav from "../../components/main/MainNav.jsx";
import TeamCard from "../../components/teams/TeamCard.jsx";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";
import './Teams.css';
import {useNavigate} from "react-router-dom";

function Teams(){
    // initializing navigate from react-router-dom
    const navigate = useNavigate();
    // getting the token from localStorage
    const token = localStorage.getItem('access_token')
    // initializing state variables for user and teams
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);

    // function to navigate to the add team page
    const navigateToAddTeam = () => {
        navigate('/add-team');
    }

    // useEffect to fetch user and teams data when the component mounts or when the token changes
    useEffect(() => {
        const fetchUserAndTeams =()=> {
            try {
                // Fetch user data from localStorage
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);

                // Fetch team memberships from localStorage
                const teamMembershipsData = JSON.parse(localStorage.getItem('teams'));
                setTeams(teamMembershipsData);
            } catch (error) {
                // If localStorage data is not available, fetch from API
                console.error("Failed to fetch user or teams:", error);
            }
        }

        if (token) {
            // Fetch user and teams data if token is available
            fetchUserAndTeams();
        }
    }, [token]); // run effect when token changes

    return(
        <>
            <MainNav teams={teams}/>
            <div className='teams-welcome-text'>
                <h1>Welcome Back <br/>{user?.name}</h1>
                <p>Please navigate to a team or add a new team</p>
            </div>
            <div className='team-card-grid'>
                {teams.length > 0 ? (
                    teams.map((membershipDetails) => (
                        <div key={membershipDetails.id} className='team-card-wrapper'>
                            <TeamCard key={membershipDetails.id} membershipDetails={membershipDetails} />
                        </div>
                    ))
                ) : (
                    <div className="no-teams">
                        <p className="no-teams-message">You are not currently a member of any teams.</p>
                        <ButtonComponent onClick={navigateToAddTeam}>Click Here To Add Team</ButtonComponent>
                    </div>
                )}
            </div>
        </>
    )
}

export default Teams;
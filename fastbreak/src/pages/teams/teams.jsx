import React,{useState, useEffect} from "react";
import {GetTeamMemberships} from "../../services/teamsAPI.js";
import {GetUser} from "../../services/userApi.js";
import MainNav from "../../components/main/MainNav.jsx";
import TeamCard from "../../components/teams/TeamCard.jsx";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";
import './Teams.css';
import {useNavigate} from "react-router-dom";

function Teams(){
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token')
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);

    const navigateToAddTeam = () => {
        navigate('/add-team');
    }

    useEffect(() => {
        const fetchUserAndTeams =()=> {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);

                const teamMembershipsData = JSON.parse(localStorage.getItem('teams'));
                setTeams(teamMembershipsData);
            } catch (error) {
                console.error("Failed to fetch user or teams:", error);
            }
        }

        if (token) {
            fetchUserAndTeams();
        }
    }, [token]);

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
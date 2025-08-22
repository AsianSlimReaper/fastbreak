import React from "react";
import ButtonComponent from "../universal/ButtonComponent.jsx";
import './TeamCard.css';
import {useNavigate} from "react-router-dom";

function TeamCard({ membershipDetails}){
    // initialize useNavigate hook from react-router-dom
    const navigate = useNavigate();
    // initialize variables from membershipDetails
    const team_name =membershipDetails.team.team_name
    const role = membershipDetails.role;
    const position =  membershipDetails.position;
    const jersey_number = membershipDetails.jersey_number ? `#${membershipDetails.jersey_number}` : "";

    // Function to navigate to the team details page
    const viewTeam = () =>{
        navigate(`/dashboard/team/${membershipDetails.team.id}`);
    }

    return (
        <div className="team-card">
            <h2>{team_name}</h2>
            <p>Role: {role}</p>
            <p>{position}</p>
            <p>{jersey_number}</p>
            <ButtonComponent onClick={viewTeam}>View</ButtonComponent>
        </div>
    );
}

export default TeamCard;
import React from "react";
import './welcomeMessage.css'

//input: currentTeam object
//output: welcome message with team name
function WelcomeMessage({ currentTeam: currentTeam }) {
    return(
        <>
            <div className='dashboard-welcome-message'>
                <h1>Welcome Back</h1>
                <p>{currentTeam?.team_name}</p>
            </div>
        </>
    )
}

export default WelcomeMessage
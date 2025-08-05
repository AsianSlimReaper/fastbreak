import React from "react";
import './welcomeMessage.css'

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
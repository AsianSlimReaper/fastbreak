import React from "react";
import './welcomeMessage.css'

function WelcomeMessage({ user: user, currentTeam: currentTeam }) {
    return(
        <>
            <div className='dashboard-welcome-message'>
                <h1>Welcome Back, <br/> {user?.name}</h1>
                <p>{currentTeam?.team_name}</p>
            </div>
        </>
    )
}

export default WelcomeMessage
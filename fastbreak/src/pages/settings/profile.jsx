import React, {useEffect, useState} from "react";
import "./profile.css"
import MainNav from "../../components/main/MainNav.jsx";

function Profile() {
    const token = localStorage.getItem('access_token')
    const [user, setUser] = useState(null);
    const [teams, setTeams] = useState([]);

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
        <div className='user-profile-container'>
            <MainNav teams={teams} setCurrentTeam={null}/>

        </div>
    )
}

export default Profile;
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import './MainNav.css';
import settingsIcon from "../../assets/settings-icon.png";

function MainNav({ teams }) {
    // MainNav component for navigation bar in the application
    const navigate = useNavigate();
    // useNavigate hook for programmatic navigation
    const [showDropdown, setShowDropdown] = useState(false);
    // State to manage the visibility of the dropdown menu
    const { teamId: currentTeamId } = useParams();
    // Extracting the current team ID from the URL parameters
    const user = JSON.parse(localStorage.getItem('user'));

    // Retrieving the user information from local storage
    const toggleDropdown = () => setShowDropdown(!showDropdown);

    // Function to toggle the visibility of the dropdown menu
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('teams');
        navigate('/');
    };

    // Function to handle user logout, clearing local storage and navigating to the login page
    const navigateHome = () => {
        navigate('/teams');
    };

    return (
        <nav className="main-nav">
            <div className="main-nav-title" onClick={navigateHome}>
                <img src={logo} alt="basketball-logo" className="main-nav-logo" />
                <h1>FastBreak</h1>
            </div>
            <div className="main-nav-teams">
                <ul>
                    {teams.map((membership) => (
                        <li
                            key={membership.id}
                            className={membership.team.id === currentTeamId ? "active-team" : ""}
                        >
                            <Link to={`/dashboard/team/${membership.team.id}`}>
                                {membership.team.team_name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link to="/add-team">+add team</Link>
                    </li>
                </ul>
            </div>
            <div className="main-nav-settings">
                <p className='main-nav-user-name'>{user.name}</p>
                <button className="settings-button" onClick={toggleDropdown}>
                    <img src={settingsIcon} alt="settings-icon" />
                </button>
                {showDropdown && (
                    <div className="dropdown-menu">
                        <p onClick={logout}>Logout</p>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default MainNav;

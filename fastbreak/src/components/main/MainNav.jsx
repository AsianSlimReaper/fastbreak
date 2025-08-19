import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import './MainNav.css';
import settingsIcon from "../../assets/settings-icon.png";

function MainNav({ teams }) {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const { teamId: currentTeamId } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('teams');
        navigate('/');
    };


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

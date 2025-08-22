import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import './landingnav.css';

function LandingNav() {
	// This component renders the navigation bar for the landing page
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	// Function to toggle the dropdown menu
	const toggleDropdown = () => {
		setDropdownOpen((prev) => !prev);
	};

	// Function to close the dropdown menu
	const closeDropdown = () => {
		setDropdownOpen(false);
	};

	// Function to navigate to the home page and close the dropdown
	const HomeClick = () => {
		navigate('/');
		closeDropdown();
	};

	return (
		<nav className="landing-top-nav">
			<div className="landing-logo-title" onClick={HomeClick}>
				<img src={logo} alt="Logo" className="landing-logo-image" />
				<h1>FastBreak</h1>
			</div>

			<div className="landing-nav-list">
				<ul>
					<li><Link to="/" onClick={closeDropdown}>Home</Link></li>
					<li><Link to="/about" onClick={closeDropdown}>About</Link></li>
					<li><Link to="/contact" onClick={closeDropdown}>Contact Us</Link></li>
				</ul>
			</div>

			<div className="login-dropdown-wrapper" onMouseLeave={closeDropdown}>
				<button className="login-dropdown-toggle" onClick={toggleDropdown}>
					Account ▾
				</button>
				{dropdownOpen && (
					<div className="login-dropdown-menu">
						<Link to="/login" onClick={closeDropdown}>Login</Link>
						<Link to="/register" onClick={closeDropdown}>Register</Link>
					</div>
				)}
			</div>
		</nav>
	);
}

export default LandingNav;

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import LandingNav from "../../components/landing/landingnav.jsx";
import { Token } from "../../services/authApi.js";
import { GetUser } from "../../services/userApi.js";
import { GetTeamMemberships } from "../../services/teamsAPI.js";
import FloatingInput from "../../components/universal/FloatingInput.jsx";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";

import './Login.css';

function Login() {
    // initialize the navigate function from react-router-dom
    const navigate = useNavigate();

    // state variables for email, password, and loading status
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // useEffect to check if the user is already logged in
    useEffect(() => {
        // Check if there is an access token in localStorage
        const token = localStorage.getItem('access_token');
        // If a token exists, navigate to the teams page
        if (token) {
            navigate('/teams');
        }
    }, []); // only run this effect once when the component mounts

    // Function to handle login
    const handleLogin = async () => {
        // Validate email and password
        setLoading(true);
        try {
            // get the token using the provided email and password
            const token = await Token(email, password);
            const user = await GetUser(token.access_token);
            const teams = await GetTeamMemberships(user.id, token.access_token);

            // Log the token, user, and teams for debugging
            console.log("Login success:", token);

            // Store the token, user, and teams in localStorage
            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('teams', JSON.stringify(teams));

            // Navigate to the teams page after successful login
            navigate('/teams');
        } catch (error) {
            // Handle errors during login
            console.error("Login failed:", error);
            // Display an alert to the user based on the error
            if (error.response && error.response.status === 401) {
                alert("Login failed: Invalid email or password.");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } finally {
            // Reset loading state after the login attempt
            setLoading(false);
        }
    };

    // Function to navigate to the registration page
    const handleRegisterNavigate = () => {
        navigate('/register');
    };

    return (
        <>
            <LandingNav />
            <main>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div className='login-frame'>
                        <h1>Login</h1>
                        <div className='login-input-wrapper'>
                            <FloatingInput
                                label='Email'
                                id='email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FloatingInput
                                label='Password'
                                id='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='login-buttons'>
                            <ButtonComponent
                                type="submit"
                                disabled={!email || !password || loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </ButtonComponent>
                            <p>Don't Have An Account?</p>
                            <ButtonComponent onClick={handleRegisterNavigate}>
                                Register
                            </ButtonComponent>
                        </div>
                    </div>
                </form>
            </main>
        </>
    );
}

export default Login;

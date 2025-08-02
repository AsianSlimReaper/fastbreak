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
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/teams');
        }
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const token = await Token(email, password);
            const user = await GetUser(token.access_token);
            const teams = await GetTeamMemberships(user.id, token.access_token);

            console.log("Login success:", token);

            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('teams', JSON.stringify(teams));

            navigate('/teams');
        } catch (error) {
            console.error("Login failed:", error);
            if (error.response && error.response.status === 401) {
                alert("Login failed: Invalid email or password.");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

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

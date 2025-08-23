import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import LandingNav from "../../components/landing/landingnav.jsx";
import { CreateUser } from "../../services/authApi.js";
import FloatingInput from "../../components/universal/FloatingInput.jsx";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";

import './Register.css';

function Register() {
	//initializing the navigate function from react-router-dom
	const navigate = useNavigate();

	//state variables for user input
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	//function to handle the registration process
	const handleRegister = async (e) => {
		//preventing the default form submission behavior
		e.preventDefault();

		//constructing the full name from first and last name
		const name = `${firstName} ${lastName}`.trim();

		//validating the input fields
		if (!firstName || !lastName || !email || !password) {
			alert("All fields are required.");
			return;
		}

		//setting loading state to true to indicate the process has started
		setLoading(true);

		//attempting to create a new user using the CreateUser service
		try {
			//calling the CreateUser function with the user's name, email, and password
			const data = await CreateUser(name, email, password);
			//if successful, log the data and navigate to the login page
			console.log('Registration Success', data);
			// redirecting the user to the login page after successful registration
			navigate('/login');
		} catch (error) {
			//if an error occurs, log the error and alert the user
			console.error('Registration failed', error.response?.data?.detail || error);
			alert('Registration failed, please ensure data is valid and try again.');
		} finally {
			//setting loading state to false to indicate the process has ended
			setLoading(false);
		}
	};

	return (
		<>
			<LandingNav />
			<main>
				<form onSubmit={handleRegister}>
					<div className='register-container'>
						<p><Link to='/login'>← Back to Login</Link></p>
						<h1>Register</h1>
						<div className='register-input-wrapper'>
							<div className='register-name-wrapper'>
								<FloatingInput
									label='First Name'
									id='first-name'
									value={firstName}
									onChange={e => setFirstName(e.target.value)}
								/>
								<FloatingInput
									label='Last Name'
									id='last-name'
									value={lastName}
									onChange={e => setLastName(e.target.value)}
								/>
							</div>
							<FloatingInput
								label='Email'
								id='email'
								type='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							<FloatingInput
								label='Password'
								id='password'
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
						</div>
						<div className='register-button-wrapper'>
							<ButtonComponent
								type="submit"
								disabled={loading || !firstName || !lastName || !email || !password}
							>
								{loading ? "Registering..." : "Register"}
							</ButtonComponent>
						</div>
					</div>
				</form>
			</main>
		</>
	);
}

export default Register;

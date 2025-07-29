import React, { useState } from 'react';
import LandingNav from "../../components/landing/landingnav.jsx";
import { CreateUser } from "../../services/authApi.js";
import FloatingInput from "../../components/universal/FloatingInput.jsx";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";
import { Link, useNavigate } from "react-router-dom";
import './Register.css';

function Register() {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading,setLoading] = useState(false);

	const handleRegister = async () => {
		const name = `${firstName} ${lastName}`.trim();

		setLoading(true)
		try {
			const data = await CreateUser(name,email,password);
			console.log('Registration Success', data);
			navigate('/login');
		} catch (error) {
			console.error('Registration failed', error.response?.data?.detail || error);
			alert('Registration failed, please ensure data is valid and try again');
		} finally {
			setLoading(false)
		}
	};

	return (
		<>
			<LandingNav />
			<main>
				<div className='register-container'>
					<p><Link to='/login'>←Back to Login</Link></p>
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
						<ButtonComponent onClick={handleRegister} disabled={loading}>Register</ButtonComponent>
					</div>
				</div>
			</main>
		</>
	);
}

export default Register;

import React, { useState } from 'react';
import './contact.css';
import LandingNav from '../../components/landing/landingnav.jsx';
import FloatingInput from '../../components/universal/FloatingInput.jsx';
import ButtonComponent from '../../components/universal/ButtonComponent.jsx';
import Footer from '../../components/landing/Footer.jsx';

function Contact() {
	// Form state
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form has been submitted - this is a placeholder");
		console.log(formData);
		// Optionally reset form
		setFormData({ name: '', email: '', subject: '', message: '' });
	};

	return (
		<>
			<main>
				<LandingNav />
				<form onSubmit={handleSubmit}>
					<div className="contact-form-wrapper">
						<h1>Contact Us</h1>
						<div className="contact-input-wrapper">
							<FloatingInput
								label="Name"
								id="name"
								value={formData.name}
								onChange={handleChange}
							/>
							<FloatingInput
								label="Email"
								id="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
							/>
							<FloatingInput
								label="Subject"
								id="subject"
								value={formData.subject}
								onChange={handleChange}
							/>
						</div>
						<div className="contact-text-area-wrapper">
							<label htmlFor="message" className="sr-only">Message</label>
							<textarea
								id="message"
								placeholder="Message"
								required
								value={formData.message}
								onChange={handleChange}
							/>
						</div>
						<div className="contact-button-wrapper">
							<ButtonComponent type="submit">Submit</ButtonComponent>
						</div>
					</div>
				</form>
				<Footer />
			</main>
		</>
	);
}

export default Contact;

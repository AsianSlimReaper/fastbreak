import React, { useState, useEffect } from 'react';
import './FloatingInput.css';


//adapted from uiverse
function FloatingLabelInput({ label, id, type = 'text', required = false, value, onChange }) {
	const [isFilled, setIsFilled] = useState(false);

	useEffect(() => {
		setIsFilled(value !== '');
	}, [value]);

	return (
		<div className={`form-control ${isFilled ? 'filled' : ''}`}>
			<input
				type={type}
				id={id}
				name={id}
				required={required}
				autoComplete="off"
				value={value}
				onChange={onChange}
			/>
			<label htmlFor={id}>
				{label.split('').map((char, index) => (
					<span key={index} style={{ transitionDelay: `${index * 50}ms` }}>
            {char}
          </span>
				))}
			</label>
		</div>
	);
}

export default FloatingLabelInput;

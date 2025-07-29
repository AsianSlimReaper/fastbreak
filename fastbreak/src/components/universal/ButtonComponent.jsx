import React from 'react';
import './ButtonComponent.css';

const Button = ({ children,
                    onClick,
                    type = 'button',
                    className = '',
                    disabled = false}) => {
    return (
      <button
          type={type}
          className={`app-button ${className}`}
          onClick={onClick}
          disabled={disabled}>
        {children}
      </button>
    );
};

export default Button;

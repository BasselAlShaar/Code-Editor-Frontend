import React from 'react';
import './style.css';

const Button = ({ text, onClick, variant = 'primary', disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {text || children}
    </button>
  );
};

export default Button;

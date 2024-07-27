import React from 'react';
import './style.css'; // Optional: Add your styles for the popup

const Popup = ({ message, onClose, caution }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{caution}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;

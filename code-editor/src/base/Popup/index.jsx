import React from 'react';
import './style.css';

const Popup = ({ message, onClose, caution }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        {caution && <span className="popup-caution">{caution}</span>}
        <p className="popup-message">{message}</p>
        <button className="popup-close" onClick={onClose}>Dismiss</button>
      </div>
    </div>
  );
};

export default Popup;

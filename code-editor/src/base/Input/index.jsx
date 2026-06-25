import React from 'react';
import './style.css';

const Input = ({ placeHolder, type = 'text', onTextChange, label, width }) => {
  return (
    <div className="field" style={width ? { width } : {}}>
      {label && <label>{label}</label>}
      <input
        type={type}
        placeholder={placeHolder}
        onChange={(e) => onTextChange(e)}
      />
    </div>
  );
};

export default Input;

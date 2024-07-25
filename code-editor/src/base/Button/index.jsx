import React from 'react';
import "./style.css"
import '../../styles/colors.css'
import '../../styles/utilities.css'
const Button = ({text,bgColor,textColor,onClick})=>{

    return(
        <button 
        onClick={onClick}
        className={`flex center rounded clickable ${bgColor} ${textColor} bold  button`}>
        {text}
        </button>
    )
}

export default Button;
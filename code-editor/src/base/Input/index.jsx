import React from 'react';
import './style.css'
import '../../styles/colors.css'
import '../../styles/utilities.css'

const Input = ({placeHolder,type,onTextChange , width}) => {


    return (
        <div className='flex column full-width my-input center'>
            <input 
            type={type}
            className='rounded '
            placeholder={placeHolder}
            onChange={(e)=>onTextChange(e)}
            width={'width'}
            ></input>
        </div>
    )
}

export default Input;
import React, { useEffect } from "react";
import { useState } from "react";
import './style.css'
import Input from "../../base/Input";
import Button from "../../base/Button";
import Socials from "../../components/Socials"
import Popup from "../../base/Popup";
import { useNavigate } from "react-router-dom";
const SignInForm = () => {

  const nav = useNavigate();

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const [isEmptyFieldsPopup, setEmptyFieldsPopup] = useState(false);

  const toggleEmptyFieldsPopup = () => {
    setEmptyFieldsPopup(!isEmptyFieldsPopup);
  };


  const [password,setPassword]=useState('');


  const [email,setEmail] = useState('');
  const [emailFlag,setEmailFlag]=useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setEmailFlag(email !== '' && !validateEmail(email));
  }, [email]);

  /* 
  const validatePassword = () => {
    // Minimum 8 characters, at least one letter, one number and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };*/

  const handleLogin = async (e)=>{
      e.preventDefault();
      if(email===''||password===''){
        toggleEmptyFieldsPopup();
      }
      else {
      const URL = 'http://127.0.0.1:8000/api/login';
      const response = await fetch(URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log(data);
      //console.log(data.authorisation.token);
      if(data.message==="Invalid email or password."){
        togglePopup();
      }
      else if(data.status==="success"){
        localStorage.setItem("user-token",data.authorisation.token);
        nav('/');
      }
    }
  }

  return (
    <div className="form-container sign-in-container">
      <form>
        <h1>Sign in</h1>
        <Socials></Socials>
        <span>or use your account</span>
        <Input className='login-input' placeHolder='Email' type='text' onTextChange={(e) => {setEmail(e.target.value)}}></Input>
        <Input className='login-input' placeHolder='Password' type='password' onTextChange={(e)=>{setPassword(e.target.value)}}></Input>
        <a href="#">Forgot your password?</a>
        <Button text='Sign in' onClick={handleLogin}></Button>
        {emailFlag && <p>Invalid Email</p>}
        {isPopupVisible && <Popup caution={'Careful!!'} message='Wrong email or password' onClose={()=>{setIsPopupVisible(false)}}></Popup>}
        {isEmptyFieldsPopup && <Popup caution={'Careful!!'} message='Can not have empty fields' onClose={()=>{setEmptyFieldsPopup(false)}}></Popup>}
      </form>
    </div>
  );
}

export default SignInForm;
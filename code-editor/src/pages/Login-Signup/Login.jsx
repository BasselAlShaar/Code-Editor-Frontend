import React, { useEffect, useState } from "react";
import './style.css';
import Input from "../../base/Input";
import { useNavigate } from "react-router-dom";

const SignInForm = ({ onSwitchToSignup }) => {
  const nav = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [emailFlag, setEmailFlag] = useState(false);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  useEffect(() => {
    setEmailFlag(email !== '' && !validateEmail(email));
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('All fields are required.'); return; }

    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.message === "Invalid email or password.") {
      setError('Invalid email or password.');
    } else if (data.status === "success") {
      localStorage.setItem("user-token", data.authorisation.token);
      nav(data.role === 'admin' ? "/admin" : '/');
    }
  };

  return (
    <div className="auth-panel">
      <div>
        <h1 className="auth-panel-title">Welcome back</h1>
        <p className="auth-panel-sub">Sign in to your CollabCode account</p>
      </div>

      <div className="auth-panel-body">
        <Input placeHolder="Email address" type="text"     onTextChange={(e) => setEmail(e.target.value)} />
        <Input placeHolder="Password"      type="password" onTextChange={(e) => setPassword(e.target.value)} />
        <button className="auth-forgot">Forgot password?</button>
      </div>

      {(error || emailFlag) && (
        <p className="auth-error">{error || 'Enter a valid email address.'}</p>
      )}

      <div className="auth-panel-actions">
        <button className="auth-submit-btn" onClick={handleLogin}>Sign in</button>
        <p className="auth-switch-text">
          No account?
          <button className="auth-switch-link" onClick={onSwitchToSignup}>Create one</button>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;

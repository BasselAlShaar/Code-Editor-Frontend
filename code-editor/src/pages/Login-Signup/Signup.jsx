import React, { useEffect, useState } from "react";
import "./style.css";
import Input from "../../base/Input";

const SignUpForm = ({ onSwitchToLogin, onSuccess }) => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError]       = useState('');
  const [emailFlag, setEmailFlag] = useState(false);
  const [passwordMatchFlag, setPasswordMatchFlag] = useState(false);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  useEffect(() => {
    setEmailFlag(email !== '' && !validateEmail(email));
  }, [email]);

  useEffect(() => {
    setPasswordMatchFlag(
      password1 !== '' && password2 !== '' && password1 !== password2
    );
  }, [password1, password2]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !name || !password1 || !password2) { setError('All fields are required.'); return; }
    if (password1 !== password2) { setError('Passwords do not match.'); return; }

    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: password1 }),
    });
    const data = await response.json();
    if (data.message === "User created successfully") {
      onSuccess?.();
    }
  };

  return (
    <div className="auth-panel">
      <div>
        <h1 className="auth-panel-title">Create account</h1>
        <p className="auth-panel-sub">Join the CollabCode developer community</p>
      </div>

      <div className="auth-panel-body">
        <Input placeHolder="Full name"       type="text"     onTextChange={(e) => setName(e.target.value)} />
        <Input placeHolder="Email address"   type="text"     onTextChange={(e) => setEmail(e.target.value)} />
        <Input placeHolder="Password"        type="password" onTextChange={(e) => setPassword1(e.target.value)} />
        <Input placeHolder="Confirm password" type="password" onTextChange={(e) => setPassword2(e.target.value)} />
      </div>

      {(error || emailFlag || passwordMatchFlag) && (
        <p className="auth-error">
          {error || (emailFlag ? 'Enter a valid email address.' : 'Passwords do not match.')}
        </p>
      )}

      <div className="auth-panel-actions">
        <button className="auth-submit-btn" onClick={handleSignup}>Create account</button>
        <p className="auth-switch-text">
          Already have an account?
          <button className="auth-switch-link" onClick={onSwitchToLogin}>Sign in</button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;

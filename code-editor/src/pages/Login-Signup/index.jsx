import React, { useState } from "react";
import "./style.css";
import SignInForm  from "./Login.jsx";
import SignUpForm  from "./Signup.jsx";
import Popup from "../../base/Popup";

const PROMO = {
  signIn: {
    heading: "Welcome back.",
    body:    "Pick up where you left off. Your code and conversations are waiting.",
  },
  signUp: {
    heading: "Built for devs.",
    body:    "Write code, run it, and talk to teammates — all without switching apps.",
  },
};

const LoginSignup = () => {
  const [mode, setMode]           = useState('signIn');
  const [successPopup, setSuccess] = useState(false);

  const promo = PROMO[mode];

  return (
    <div className="auth-page">
      <div className="auth-card">
        {mode === 'signIn' ? (
          <SignInForm onSwitchToSignup={() => setMode('signUp')} />
        ) : (
          <SignUpForm
            onSwitchToLogin={() => setMode('signIn')}
            onSuccess={() => { setSuccess(true); setMode('signIn'); }}
          />
        )}

        <div className="auth-divider" />

        <div className="auth-promo">
          <div className="auth-promo-logo">
            <span>{'{'}</span>CollabCode<span>{'}'}</span>
          </div>
          <div>
            <h2>{promo.heading}</h2>
            <p>{promo.body}</p>
          </div>
        </div>
      </div>

      {successPopup && (
        <Popup
          caution="Account created"
          message="You can sign in now."
          onClose={() => setSuccess(false)}
        />
      )}
    </div>
  );
};

export default LoginSignup;

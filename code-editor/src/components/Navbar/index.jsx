import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    setIsLoggedIn(false);
  };

  return (
    <div className="landing-header">
      <nav className="navbar">
        <div className="logo">Logo</div>
        <ul className="nav-links">
          <li>
            <Link to="/">Code</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout} className="login-btn">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <button className="login-btn" onClick={()=>{navigate("/login");}}>Login</button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

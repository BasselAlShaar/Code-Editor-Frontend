import React from "react";
import "./style.css";

const Navbar = () => {
    return (
        <div className="landing-header">
            <nav className="navbar">
                <div className="logo">Logo</div>
                <ul className="nav-links">
                    <li><a href="#code-editor">Code Editor</a></li>
                    <li><a href="#chat">Chat</a></li>
                    <li><a href="#profile">Profile</a></li>
                    <li><a href="#sourcecode">Source Code</a></li>
                    <li><a href="/login" className="login-btn">Login</a></li>
                </ul>
            </nav>
        </div>
    )
};
export default Navbar;










import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="landing-header">
            <nav className="navbar">
                <div className="logo">Logo</div>
                <ul className="nav-links">
                    <li><Link to={"/code"}>Code</Link></li>
                    <li><Link to={"/chat"}>Chat</Link></li>
                    <li><Link to={"/profile"}>Profile</Link></li>
                    <li><Link to={"/login"} className="login-btn">Login</Link></li>
                </ul>
            </nav>
        </div>
    )
};
export default Navbar;










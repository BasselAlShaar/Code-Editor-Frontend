import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="landing-header">
            <nav className="navbar">
                <div className="logo">Logo</div>
                <ul className="nav-links">
                    <li><Link to={"/"}>Code</Link></li>
                    <li><Link to={"/"}>Chat</Link></li>
                    <li><Link to={"/"}>Profile</Link></li>
                    <li><Link to={"/login"} className="login-btn">Login</Link></li>
                </ul>
            </nav>
        </div>
    )
};
export default Navbar;










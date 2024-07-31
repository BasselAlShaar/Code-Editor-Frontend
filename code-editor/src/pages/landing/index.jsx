// src/LandingPage.js

import React from "react";
import "./style.css";
import Navbar from "../../components/NavBar";
import ContactUs from "../../components/ContactUs"
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <section id="features" className="features-section">
        <h2>Features</h2>
        <div className="features">
          <div className="feature">
            <h3>Interactive Code Editor</h3>
            <p>Write and compile Python code in real-time.</p>
          </div>
          <div className="feature">
            <h3>Developer Search</h3>
            <p>Find and connect with other developers.</p>
          </div>
          <div className="feature">
            <h3>Save and Download Code</h3>
            <p>Save your projects and download them anytime.</p>
          </div>
          <div className="feature">
            <h3>Chat with Developers</h3>
            <p>Discuss and collaborate on projects.</p>
          </div>
          <div className="feature">
            <h3>Admin Tools</h3>
            <p>Manage users and bulk import user data from Excel/CSV files.</p>
          </div>
        </div>
        <div className="header-content">
          <Link to={"/login"} className="signup-btn">
            Get Started
          </Link>
        </div>
      </section>
      <section id="developers" className="developers-section">
        <h2>Our Developers</h2>
        <p>Meet our talented and diverse developer community.</p>
      </section>
      <ContactUs />
      <footer className="landing-footer">
        <p>&copy; 2024 All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

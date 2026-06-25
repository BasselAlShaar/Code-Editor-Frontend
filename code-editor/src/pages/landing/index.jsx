import React from "react";
import "./style.css";
import ContactUs from "../../components/ContactUs";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const FEATURES = [
  { icon: "</>",  title: "Interactive Code Editor", desc: "Write, run, and save code in 5 languages — powered by Monaco and Judge0." },
  { icon: "~~",   title: "Developer Search",         desc: "Find and connect with other developers on the platform." },
  { icon: "↓",   title: "Save & Download",           desc: "Persist your snippets to your account and export them anytime." },
  { icon: "#",    title: "Direct Messaging",          desc: "Chat privately with teammates to discuss code and collaborate." },
  { icon: "⚙",   title: "Admin Tools",               desc: "Manage users and bulk-import accounts from Excel or CSV." },
];

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />

      <section className="hero">
        <span className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Code. Chat. Ship.
        </span>

        <h1 className="hero-title">
          The workspace built<br />for <span className="hero-title-accent">developers</span>
        </h1>

        <p className="hero-sub">
          CollabCode combines a full Monaco editor with real-time messaging —
          so you can write, run, and talk about code without switching tabs.
        </p>

        <div className="hero-actions">
          <Link to="/login" className="btn-hero-primary">Get started →</Link>
          <Link to="/code"  className="btn-hero-ghost">Try the editor</Link>
        </div>
      </section>

      <section className="features-section">
        <p className="section-label">// features</p>
        <h2 className="section-title">Everything you need, nothing you don't</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon mono">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="developers-section">
        <h2>Our Developers</h2>
        <p>Meet the talented community building on CollabCode.</p>
      </section>

      <ContactUs />

      <footer className="landing-footer">
        <p>&copy; 2024 CollabCode. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

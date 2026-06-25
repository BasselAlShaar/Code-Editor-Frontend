import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./style.css";

const NAV_LINKS = [
  { to: "/code",    label: "Code",    icon: "<>" },
  { to: "/chat",    label: "Chat",    icon: "#"  },
  { to: "/profile", label: "Profile", icon: "@"  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user-token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    setIsLoggedIn(false);
  };

  return (
    <header className="navbar-shell">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-icon">{"{"}</span>
        CollabCode
        <span className="navbar-logo-cursor" aria-hidden="true" />
      </Link>

      <ul className="navbar-links">
        {NAV_LINKS.map(({ to, label, icon }) => (
          <li key={to}>
            <Link
              to={to}
              className={location.pathname === to ? "active" : ""}
            >
              <span className="mono" style={{ fontSize: 11, opacity: 0.6 }}>{icon}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="navbar-end">
        {isLoggedIn ? (
          <button className="nav-btn-ghost" onClick={handleLogout}>
            Sign out
          </button>
        ) : (
          <button className="nav-btn-primary" onClick={() => navigate("/login")}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

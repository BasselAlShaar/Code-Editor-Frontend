import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./style.css";
import Navbar from "../../components/Navbar";

const Profile = () => {
  const [userInfo, setUserInfo]       = useState({ id: null, name: "", email: "" });
  const [codes, setCodes]             = useState([]);
  const [newName, setNewName]         = useState("");
  const [newEmail, setNewEmail]       = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editing, setEditing]         = useState(false);
  const [passwordMatchFlag, setPasswordMatchFlag] = useState(false);

  const token    = localStorage.getItem("user-token");
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordMatchFlag(
      newPassword !== "" && confirmPassword !== "" && newPassword !== confirmPassword
    );
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (token) {
      const userId = jwtDecode(token).sub;
      fetchUserInfo(userId);
    }
  }, [token]);

  useEffect(() => {
    if (userInfo.id) fetchUserCodes();
  }, [userInfo.id]);

  const fetchUserInfo = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(res.data.user);
      setNewName(res.data.user.name);
      setNewEmail(res.data.user.email);
    } catch {}
  };

  const fetchUserCodes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/codes", {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: userInfo.id },
      });
      setCodes(res.data.codes);
    } catch {}
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/users`,
        { name: newName, email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserInfo({ ...userInfo, name: newName, email: newEmail });
      setEditing(false);
    } catch {}
  };

  const handleChangePassword = async () => {
    if (passwordMatchFlag) return;
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/users/password`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("user-token");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-layout">
          <h1 className="profile-page-title">Account</h1>

          {/* User info */}
          <div className="profile-section">
            <p className="profile-section-title">// profile</p>

            {editing ? (
              <div className="profile-input-group">
                <div>
                  <span className="profile-input-label">Name</span>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" />
                </div>
                <div>
                  <span className="profile-input-label">Email</span>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" />
                </div>
                <div className="profile-btn-row">
                  <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={handleEdit}>Save changes</button>
                  <button className="btn btn-ghost"   style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-field-row">
                  <span className="profile-field-label">Name</span>
                  <div className="profile-field-value">{userInfo.name}</div>
                </div>
                <div className="profile-field-row">
                  <span className="profile-field-label">Email</span>
                  <div className="profile-field-value">{userInfo.email}</div>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 14px', alignSelf: 'flex-start' }} onClick={() => setEditing(true)}>
                  Edit info
                </button>
              </>
            )}
          </div>

          {/* Saved codes */}
          <div className="profile-section">
            <p className="profile-section-title">// saved snippets</p>
            {codes.length > 0 ? (
              <ul className="profile-codes-list">
                {codes.map((code) => (
                  <li className="profile-code-item" key={code.id}>
                    <div className="profile-code-title">{code.title}</div>
                    <pre className="profile-code-snippet">{code.content}</pre>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="profile-empty">No snippets saved yet.</p>
            )}
          </div>

          {/* Password */}
          <div className="profile-section">
            <p className="profile-section-title">// change password</p>
            <div className="profile-input-group">
              <div>
                <span className="profile-input-label">Current password</span>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div>
                <span className="profile-input-label">New password</span>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div>
                <span className="profile-input-label">Confirm new password</span>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {passwordMatchFlag && <p className="profile-error">// passwords do not match</p>}
              <button
                className="btn btn-ghost"
                style={{ fontSize: 12, padding: '6px 14px', alignSelf: 'flex-start' }}
                onClick={handleChangePassword}
                disabled={passwordMatchFlag}
              >
                Update password
              </button>
            </div>
          </div>

          <button className="profile-logout-btn" onClick={logout}>Sign out</button>
        </div>
      </div>
    </>
  );
};

export default Profile;

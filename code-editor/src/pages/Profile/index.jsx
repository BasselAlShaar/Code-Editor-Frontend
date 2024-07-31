import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./style.css";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({ id: null, name: "", email: "" });
  const [codes, setCodes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [passwordMatchFlag, setPasswordMatchFlag] = useState(true);

  const token = localStorage.getItem("user-token");

  const navigate = useNavigate();

  const matchPassword = (newPassword, confirmPassword) => {
    return newPassword === confirmPassword;
  };

  useEffect(() => {
    setPasswordMatchFlag(
      newPassword !== "" &&
        confirmPassword !== "" &&
        !matchPassword(newPassword, confirmPassword)
    );
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub; // Assuming 'sub' contains the user ID
      fetchUserInfo(userId);
    }
  }, [token]);

  useEffect(() => {
    if (userInfo.id) {
      fetchUserCodes();
      fetchUserMessages();
    }
  }, [userInfo.id]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data.user);
      setNewName(response.data.user.name);
      setNewEmail(response.data.user.email);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserCodes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/codes", {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: userInfo.id },
      });
      setCodes(response.data.codes);
    } catch (error) {
      console.error("Error fetching user codes:", error);
    }
  };

  const fetchUserMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: userInfo.id },
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching user messages:", error);
    }
  };

  const handleEdit = async () => {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub;
    try {
      await axios.put(
        `http://localhost:8000/api/users/${userId}`,
        { name: newName, email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserInfo({ ...userInfo, name: newName, email: newEmail });
      setEditing(false);
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleChangePassword = async () => {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub;
    try {
      if (!passwordMatchFlag) {
        await axios.put(
          `http://localhost:8000/api/users/password`,
          newPassword,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
      else { 
        console.log("no match")
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user-token");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <div className="profile-info">
        <h2>User Information</h2>
        {editing ? (
          <div className="profile-info-inputs">
            <label>Name:</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <label>Email:</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button className="edit-btn" onClick={handleEdit}>
              Save
            </button>
            <button className="edit-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p>Name: {userInfo.name}</p>
            <p>Email: {userInfo.email}</p>
            <div className="edit-btn-container">
              <button onClick={() => setEditing(true)} className="edit-btn">
                Edit Info
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="profile-codes">
        <h2>Your Codes</h2>
        {codes.length > 0 ? (
          <ul>
            {codes.map((code) => (
              <li key={code.id}>
                <h3>{code.title}</h3>
                <p>{code.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No codes available.</p>
        )}
      </div>
      <div className="profile-change-password">
        <h2>Change Password</h2>
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>Confirm New Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {passwordMatchFlag && (
          <p className="no-match">Passwords do not match</p>
        )}
        <div className="password-button">
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      </div>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;

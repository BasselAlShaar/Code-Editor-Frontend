import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const token = localStorage.getItem("user-token");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo.id) {
      fetchUserCodes();
      fetchUserMessages();
    }
  }, [userInfo.id]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    try {
      await axios.put(
        "http://localhost:8000/api/user",
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
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await axios.put(
        "http://localhost:8000/api/user/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password.");
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <div className="profile-info">
        <h2>User Information</h2>
        {editing ? (
          <div>
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
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>Name: {userInfo.name}</p>
            <p>Email: {userInfo.email}</p>
            <button onClick={() => setEditing(true)}>Edit Info</button>
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
      <div className="profile-messages">
        <h2>Your Messages</h2>
        {messages.length > 0 ? (
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <p>
                  <strong>From:</strong> {message.sender_id},{" "}
                  <strong>To:</strong> {message.receiver_id}
                </p>
                <p>{message.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages available.</p>
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
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  );
};

export default Profile;

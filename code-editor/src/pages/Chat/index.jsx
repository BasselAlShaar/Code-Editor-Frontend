import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./style.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Chat = () => {
  const navigate = useNavigate();
  const [chats, setChats]             = useState([]);
  const [users, setUsers]             = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages]       = useState([]);
  const [newMessage, setNewMessage]   = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("user-token");
  let userId;
  let tokenError = false;

  try {
    if (!token) throw new Error("No token");
    userId = jwtDecode(token).sub;
  } catch {
    tokenError = true;
  }

  useEffect(() => { if (!tokenError) fetchChats(); }, [tokenError]);
  useEffect(() => { if (tokenError) navigate('/login'); }, [tokenError]);

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { sentMessages, receivedMessages } = res.data;
      const ids = [...new Set([
        ...sentMessages.map((m) => m.receiver_id),
        ...receivedMessages.map((m) => m.sender_id),
      ])];
      const details = await Promise.all(
        ids.map((id) =>
          axios.get(`http://localhost:8000/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setChats(details.map((r) => r.data.user));
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch {}
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get("http://localhost:8000/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sent     = res.data.sentMessages.filter((m) => m.receiver_id === chatId);
      const received = res.data.receivedMessages.filter((m) => m.sender_id === chatId);
      setMessages([...sent, ...received].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
    } catch {}
  };

  const handleChatClick  = (chat) => { setCurrentChat(chat); fetchMessages(chat.id); };
  const handleNewChat    = () => { setShowAllUsers(true); fetchUsers(); };
  const handleUserClick  = (user) => {
    setCurrentChat(user);
    fetchMessages(user.id);
    setShowAllUsers(false);
    if (!chats.some((c) => c.id === user.id)) setChats((p) => [...p, user]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/messages",
        { receiver_id: currentChat.id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data.messageData]);
      setNewMessage("");
    } catch {}
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(); };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initials = (name) => name?.charAt(0).toUpperCase() || '?';

  return (
    <>
      <Navbar />
      <div className="chat-wrap">
        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <span className="chat-sidebar-title">Messages</span>
            <button className="chat-new-btn" onClick={handleNewChat}>+ New</button>
          </div>

          {showAllUsers && (
            <input
              className="chat-search"
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          <ul className="chat-list">
            {(showAllUsers ? filteredUsers : chats).map((item) => (
              <li
                key={item.id}
                className={`chat-list-item${currentChat?.id === item.id ? ' active' : ''}`}
                onClick={() => showAllUsers ? handleUserClick(item) : handleChatClick(item)}
              >
                <div className="chat-list-name">{item.name}</div>
                {!showAllUsers && <div className="chat-list-preview">Tap to open conversation</div>}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main area */}
        <main className="chat-main">
          {currentChat ? (
            <>
              <div className="chat-main-header">
                <div className="chat-main-avatar">{initials(currentChat.name)}</div>
                <span className="chat-main-name">{currentChat.name}</span>
              </div>

              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`chat-msg ${msg.sender_id == userId ? 'me' : 'them'}`}
                  >
                    <div className="chat-msg-bubble">{msg.message}</div>
                  </div>
                ))}
              </div>

              <div className="chat-input-bar">
                <input
                  className="chat-input-field"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message..."
                />
                <button className="chat-send-btn" onClick={handleSendMessage} title="Send">
                  ↑
                </button>
              </div>
            </>
          ) : (
            <div className="chat-empty-state">
              <span className="chat-empty-icon mono">#</span>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Chat;

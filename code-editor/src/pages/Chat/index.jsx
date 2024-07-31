import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "./style.css";
import { redirect, useNavigate} from "react-router-dom";
const Chat = () => {

  const navigate = useNavigate()
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("user-token");
  let userId;
  let tokenError = false;


  //const handleNoToken = () => { navigate('/login')}

  try {
    if (!token) {
      throw new Error("No token found");
    }
    const decodedToken = jwtDecode(token);
    userId = decodedToken.sub; // Assuming the user ID is in the 'sub' field of the JWT payload
  } catch (error) {
    console.error("Error decoding token:", error);
    tokenError = true;
  }

  useEffect(() => {
    if (!tokenError) {
      fetchChats();
    }
  }, [tokenError]);

  const fetchChats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { sentMessages, receivedMessages } = response.data;

      const chatUsers = [
        ...new Set([
          ...sentMessages.map((msg) => msg.receiver_id),
          ...receivedMessages.map((msg) => msg.sender_id),
        ]),
      ];

      const userResponses = await Promise.all(
        chatUsers.map((id) =>
          axios.get(`http://localhost:8000/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      const chatUsersDetails = userResponses.map((res) => res.data.user);
      setChats(chatUsersDetails);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get("http://localhost:8000/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sentMessages = response.data.sentMessages.filter(
        (message) => message.receiver_id === chatId
      );
      const receivedMessages = response.data.receivedMessages.filter(
        (message) => message.sender_id === chatId
      );
      const allMessages = [...sentMessages, ...receivedMessages].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setMessages(allMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
    fetchMessages(chat.id);
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/messages",
          {
            receiver_id: currentChat.id,
            message: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages([...messages, response.data.messageData]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleNewChat = async () => {
    setShowAllUsers(true);
    fetchUsers();
  };

  const handleUserClick = (user) => {
    setCurrentChat(user);
    fetchMessages(user.id);
    setShowAllUsers(false);

    // Add the new user to the chats list if not already present
    if (!chats.some((chat) => chat.id === user.id)) {
      setChats((prevChats) => [...prevChats, user]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => { 
    if (tokenError) {
      navigate('/login')
    }
  },[tokenError])

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>
          New Chat
        </button>
        {showAllUsers && (
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        )}
        <ul className="chat-list">
          {showAllUsers
            ? filteredUsers.map((user) => (
                <li key={user.id} onClick={() => handleUserClick(user)}>
                  <div className="chat-name">{user.name}</div>
                </li>
              ))
            : chats.map((chat) => (
                <li key={chat.id} onClick={() => handleChatClick(chat)}>
                  <div className="chat-name">{chat.name}</div>
                  <div className="chat-last-message">Last message here...</div>
                </li>
              ))}
        </ul>
      </div>
      <div className="chat-main">
        {currentChat ? (
          <>
            <div className="chat-header">Chat with {currentChat.name}</div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    message.sender_id == userId ? "me" : "them"
                  }`}
                >
                  <p>{message.message}</p>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={handleNewMessageChange}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            Select a chat to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

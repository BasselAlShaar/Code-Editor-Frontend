import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(1); // Replace with the logged-in user's ID
  const [token, setToken] = useState(localStorage.getItem("jwtToken")); // Retrieve token from local storage or state

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers();
  }, []);

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
      const response = await axios.get(
        `http://localhost:8000/api/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          `http://localhost:8000/api/messages/${userId}`,
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

  const handleNewChat = () => {
    // Logic to show a list of users to start a new chat with
    console.log(users);
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>
          New Chat
        </button>
        <ul className="chat-list">
          {users.map((user) => (
            <li key={user.id} onClick={() => handleChatClick(user)}>
              <div className="chat-name">{user.name}</div>
              {/* Placeholder for last message, update if needed */}
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
                    message.sender_id === userId ? "me" : "them"
                  }`}
                >
                  {message.message}
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

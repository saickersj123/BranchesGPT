import React from 'react';
import '../css/ChatMessage.css'; 

const ChatMessage = ({ message, sentByUser, username, time }) => {
  const timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className={`message-container ${sentByUser ? 'sent-by-user' : 'received'}`}>
      {username && (
        <div className="username">{username}</div>
      )}
      <div className="bubble-container">
        <div className="bubble">
          {message}
        </div>
        <div className="time">{timeString}</div>
      </div>
    </div>
  );
};

export default ChatMessage;

// ChatMessage.js
import React from 'react';
import '../css/ChatMessage.css'; 

const ChatMessage = ({ message, sentByUser, username, time, showTime, showUsername }) => {
  const timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`message-container ${sentByUser ? 'sent-by-user' : 'received'}`}>
      {!sentByUser && (
        !showTime ? (
          <div className="username">{username}</div>
        ) : null
      )}
      <div className="bubble-container">
        <div className="bubble">
          {message}
        </div>
        {showTime && <div className="time">{timeString}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;

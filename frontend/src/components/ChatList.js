import React, { useEffect, useState, useRef } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChatList.css'; 

const ChatMessage = ({ content, role, time, username }) => {
  let timeString = '';
  if (time && !isNaN(new Date(time).getTime())) {
    timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } else {
    timeString = 'Invalid Date';
  }
  const displayUsername = role === 'assistant' ? 'AI' : (username || 'You');

  return (
    <div className={`message-container ${role === 'user' ? 'sent-by-user' : 'received'}`}>
      <div className="username">{displayUsername}</div>
      <div className="bubble-container">
        <div className="bubble">
          {content}
        </div>
        <div className={`time ${role === 'user' ? 'time-user' : 'time-assistant'}`}>{timeString}</div>
      </div>
    </div>
  );
};

const ChatList = ({ messages, username }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  return (
    <Container className="chat-list-container mt-3">
      {messages.length === 0 ? (
        <div className="alert alert-info text-center">
          새로운 채팅을 시작해 보세요!
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            role={message.role}
            time={message.createdAt}
            username={username}
          />
        ))
      )}
      <div ref={chatEndRef} />
    </Container>
  );
};

export default ChatList;

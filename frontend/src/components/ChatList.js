import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChatList.css';

const ChatMessage = ({ content, role, time }) => {
  const timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const storedName = sessionStorage.getItem('name');
  const username = role === 'assistant' ? 'AI' : (storedName ? storedName : 'You');

  return (
    <div className={`message-container ${role === 'user' ? 'sent-by-user' : 'received'}`}>
      <div className="username">{username}</div>
      <div className="bubble-container">
        <div className="bubble">
          {content}
        </div>
        <div className="time">{timeString}</div>
      </div>
    </div>
  );
};

const ChatList = ({ messages }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  return (
    <div className="chat-list-container container mt-3">
      {messages.length === 0 ? (
        <div className="alert alert-info text-center">
          새로운 채팅을 시작해 보세요!
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              role={message.role}
              time={message.createdAt}
            />
          ))}
          <div ref={chatEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatList;

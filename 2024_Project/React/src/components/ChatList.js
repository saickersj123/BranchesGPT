import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChatList.css';
import { fetchMessages } from '../api/axiosInstance';

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

const ChatList = ({ roomId }) => {
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    try {
      const data = await fetchMessages(roomId, true);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [roomId]);

  return (
    <div className="chat-list-container container mt-3">
      {messages.length === 0 ? (
        <div className="alert alert-info text-center">
          새로운 채팅을 시작해 보세요!
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.content}  // 메시지 내용
            sentByUser={message.role === 'user'}  // 메시지 역할
            username={message.role === 'user' ? 'You' : 'AI'}  // 사용자명
            time={message.time}
          />
        ))
      )}
    </div>
  );
};

export default ChatList;

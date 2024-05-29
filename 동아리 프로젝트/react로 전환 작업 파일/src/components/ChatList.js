// src/components/ChatList.js
import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatListMessage';
import '../css/ChatMessage.css';
import { fetchMessages } from '../api/axiosInstance'; // fetchMessages 함수를 가져옵니다.

const ChatList = () => {
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            sentByUser={message.sentByUser}
            username={message.username}
            time={message.time}
            showTime={message.showTime}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;

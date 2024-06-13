import React, { useState } from 'react';
import '../css/ChatBox.css';
import { sendMessage } from '../api/axiosInstance';

const ChatBox = ({ roomId }) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessageToChatList = async () => {
    if (message.trim() === '') return;

    try {
      const response = await sendMessage(message, roomId);
      console.log('Message sent:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessageToChatList();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="textarea-wrapper">
        <textarea
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className="chat-container"
        />
        <button onClick={sendMessageToChatList} className="chat-box-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M9.354 3.354a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L12.293 8 9.354 5.146a.5.5 0 0 1 0-.708z"/>
            <path fillRule="evenodd" d="M.5 8a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

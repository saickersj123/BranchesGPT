// ChatBox.js
import React, { useState } from 'react';
import '../App.css';

const ChatBox = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessageToChatList = () => {
    if (message.trim() === '') return;
    sendMessage(message); // 전달받은 sendMessage 함수를 호출하여 메시지를 전달
    setMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 엔터 키 기본 동작 방지
      sendMessageToChatList();
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        value={message}
        onChange={handleMessageChange}
        onKeyPress={handleKeyPress}
        placeholder="메시지를 입력하세요..."
        className="chat-container" // ChatBox.css에서 정의한 클래스를 적용합니다.
      />
      <button onClick={sendMessageToChatList} className="chat-box-button">전송</button> {/* ChatBox.css에서 정의한 클래스를 적용합니다. */}
    </div>
  );
};

export default ChatBox;

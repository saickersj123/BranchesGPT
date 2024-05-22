import React, { useState } from 'react';
import '../css/ChatBox.css'; // ChatBox.css 파일의 경로 수정

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

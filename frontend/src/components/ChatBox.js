import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../css/ChatBox.css';
import { sendMessage } from '../api/axiosInstance';

const ChatBox = ({ conversationId, onNewMessage, onUpdateMessage, isEditMode, isNewChat, startNewConversationWithMessage, darkMode }) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessageToServer = async () => {
    if (message.trim() === '') return; // 빈 메시지일 경우 리턴

    const newMessage = {
      content: message,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    onNewMessage(newMessage); // 사용자 메시지를 추가하여 상태 업데이트

    try {
      if (isNewChat) {
        await startNewConversationWithMessage(message); // 사용자가 입력한 메시지로 새로운 대화 시작
      } else {
        const response = await sendMessage(conversationId, message);

        if (response && response.length > 0) {
          const aiMessage = {
            content: response[response.length - 1].content,
            role: 'assistant',
            createdAt: new Date().toISOString()
          };
          onUpdateMessage(aiMessage); // AI 응답 메시지를 추가하여 상태 업데이트
        }
      }
      setMessage(''); // 입력 필드 초기화
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessageToServer();
    }
  };

  return (
    <Form className={`chat-input-container ${darkMode === 'dark' ? 'dark' : ''}`} onSubmit={(e) => e.preventDefault()}>
      <Form.Group controlId="messageInput" className="textarea-wrapper">
        <Form.Control
          as="textarea"
          rows={1}
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className={`chat-container ${darkMode === 'dark' ? 'dark' : ''}`}
          disabled={isEditMode}
        />
        <Button
          type="submit"
          onClick={sendMessageToServer}
          className={`chat-box-button ${darkMode === 'dark' ? 'dark' : ''}`}
          disabled={isEditMode}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M9.354 3.354a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L12.293 8 9.354 5.146a.5.5 0 0 1 0-.708z"/>
            <path fillRule="evenodd" d="M.5 8a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </Button>
      </Form.Group>
    </Form>
  );
};

export default ChatBox;

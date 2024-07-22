// ChatBox.js

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../css/ChatBox.css';
import { useNavigate } from 'react-router-dom';
import { sendMessage, startNewConversationwithmsg } from '../api/axiosInstance';

const ChatBox = ({
  conversationId,
  onNewMessage,
  onUpdateMessage,
  isEditMode,
  isNewChat,
  selectedModel,  // Added prop
  onChatInputAttempt,
  isLoggedIn,
  onNewConversation,
  setSelectedConversationId
}) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleMessageChange = (event) => {
    if (!isLoggedIn) {
      onChatInputAttempt();
    } else {
      setMessage(event.target.value);
    }
  };

  const sendMessageToServer = async () => {
    if (message.trim() === '') return;

    const newMessage = {
      content: message,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    onNewMessage(newMessage);

    try {
      if (isNewChat) {
        const response = await startNewConversationwithmsg(message);
        const newConversationId = response.id;
        onNewConversation(newConversationId);
        navigate(`/chat`);
        if (response && response.length > 0) {
          const aiMessage = {
            content: response[response.length - 1].content,
            role: 'assistant',
            createdAt: new Date().toISOString(),
          };
          onUpdateMessage(aiMessage);
        }
      } else {
        const response = await sendMessage(conversationId, message);
        if (response && response.length > 0) {
          const aiMessage = {
            content: response[response.length - 1].content,
            role: 'assistant',
            createdAt: new Date().toISOString(),
          };
          onUpdateMessage(aiMessage);
        }
      }
      setMessage('');
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
    <Form className={`chat-input-container`} onSubmit={(e) => e.preventDefault()}>
      <Form.Group controlId="messageInput" className="textarea-wrapper">
        <Form.Control
          as="textarea"
          rows={1}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyPress}
          placeholder="메시지를 입력하세요."
          className={`chat-container`}
          disabled={isEditMode}
        />
        <Button
          type="submit"
          onClick={sendMessageToServer}
          className={`chat-box-button`}
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

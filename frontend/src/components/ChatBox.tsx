import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../css/ChatBox.css';
import { useNavigate } from 'react-router-dom';
import { sendMessage, startNewConversationwithmsg } from '../api/axiosInstance';
import { Message, Conversation } from '../types';  // types.ts에서 Message와 Conversation을 import

interface ChatBoxProps {
  onNewMessage: (message: Message) => void;
  onUpdateMessage: (message: Message) => void;
  conversationId: string | null;
  isNewChat: boolean;
  onChatInputAttempt: () => void;
  isLoggedIn: boolean;
  selectedModel: string;
  onNewConversation: (newConversationId: string) => Promise<void>;
  isEditMode: boolean;
  setSelectedConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Message 인터페이스 제거 (이미 types.ts에서 import했으므로)

const ChatBox: React.FC<ChatBoxProps> = ({
  conversationId,
  onNewMessage,
  onUpdateMessage,
  isEditMode,
  isNewChat,
  selectedModel,
  onChatInputAttempt,
  isLoggedIn,
  onNewConversation,
  setSelectedConversationId
}) => {
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isLoggedIn) {
      onChatInputAttempt();
    } else {
      setMessage(event.target.value);
    }
  };

  const sendMessageToServer = async () => {
    if (message.trim() === '') return;

    const newMessage: Message = {
      content: message,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    onNewMessage(newMessage);

    try {
      if (isNewChat) {
        const response = await startNewConversationwithmsg(message);
        const newConversationId = response._id;  // 여기를 _id로 변경
        onNewConversation(newConversationId);
        navigate(`/chat/${newConversationId}`);  // 새 대화로 이동
        if (response && response.chats.length > 0) {
          const aiMessage: Message = {
            content: response.chats[response.chats.length - 1].content,
            role: 'assistant',
            createdAt: new Date().toISOString(),
          };
          onUpdateMessage(aiMessage);
        }
      } else if (conversationId) {
        const response = await sendMessage(conversationId, message);
        if (response && response.length > 0) {
          const aiMessage: Message = {
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
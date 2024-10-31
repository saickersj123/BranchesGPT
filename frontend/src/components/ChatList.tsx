import React, { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChatList.css';
import AI_Logo from '../img/Nlogo3.png';

interface Message {
  content: string;
  role: string;
  createdAt: string;
}

interface ChatMessageProps {
  content: string;
  role: string;
  time: string;
  username: string;
  showTime: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, time, username, showTime }) => {
  let timeString = '';
  if (time && !isNaN(new Date(time).getTime())) {
    timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } else {
    timeString = 'Invalid Date';
  }
  const displayUsername = role === 'assistant' ? 'AI' : (username || 'You');
  const bubbleStyle = {
    backgroundColor: role === 'user' ? 'var(--my-chat-bubble-color)' : 'var(--other-chat-bubble-color)',
    color: role === 'user' ? 'var(--my-chat-text-color)' : 'var(--other-chat-text-color)',
    fontWeight: 'var(--chat-bubble-bold)',
    boxShadow: 'var(--chat-bubble-shadow)',
  };

  return (
    <div className={`message-container ${role === 'user' ? 'sent-by-user' : 'received'}`}>
      {role === 'assistant' && (
        <div className="chatbot-icon">
          <img src={AI_Logo} alt="AI" />
        </div>
      )}
      <div className="bubble-wrapper">
        <div className="username">{displayUsername}</div>
        <div className="bubble-container">
          <div className="bubble" style={bubbleStyle}>
            {content}
          </div>
          {showTime && <div className="time">{timeString}</div>}
        </div>
      </div>
    </div>
  );
};

interface ChatListProps {
  messages: Message[];
  username: string;
  showTime: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ messages, username, showTime }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  return (
    <Container className="chat-list-container">
      {messages.length === 0 ? (
        <div className="alert-info text-center">
          새로운 대화를 시작해 보세요!
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            role={message.role}
            time={message.createdAt}
            username={username}
            showTime={showTime}
          />
        ))
      )}
      <div ref={chatEndRef} />
    </Container>
  );
};

export default ChatList;
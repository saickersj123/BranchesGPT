import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ChatList.css';
import { sendMessage } from '../api/axiosInstance';

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

const ChatList = ({ messages, setMessages }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      const fetchAIResponse = async () => {
        try {
          const aiResponse = await sendMessage('...'); // AI 응답을 가져옴 (실제 메시지를 변경해야 함)
          const aiMessage = {
            content: '',
            role: 'assistant',
            createdAt: new Date().toISOString()
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);

          // AI의 응답을 한 글자씩 출력
          const content = aiResponse[aiResponse.length - 1].content;
          for (let i = 0; i < content.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1].content += content[i];
              return updatedMessages;
            });
          }
        } catch (error) {
          console.error('Error getting AI response:', error);
        }
      };

      fetchAIResponse();
    }
  }, [messages, setMessages]);

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

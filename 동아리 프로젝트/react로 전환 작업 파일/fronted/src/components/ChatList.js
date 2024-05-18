// ChatList.js
import React, { useState, useEffect } from 'react';

const ChatList = () => {
  const [messages, setMessages] = useState([]); // 전송된 메시지를 저장할 상태

  // 프로토타입 메시지를 설정하는 함수
  const fetchMessages = async () => {
    // 예제 데이터를 사용
    const exampleData = [
      {
        username: '철수',
        message: 'Hello GPT world!',
        time: '2023-05-18T17:19:00'
      }
    ];
    setMessages(exampleData);
  };

  // 컴포넌트가 마운트될 때 메시지를 설정
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <div>채팅 기록(프로토타입):</div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.username}:</strong> {message.message}
            <span style={{ fontSize: '0.8em', color: 'gray', marginLeft: '10px' }}>
              {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;

// ChatList.js
import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import '../css/ChatMessage.css'; 

const ChatList = () => {
  const [messages, setMessages] = useState([]); 

  const fetchMessages = async () => {
    const exampleData = [
      {
        username: '철수',
        message: 'Hello',
        time: '2023-05-18T17:19',
        sentByUser: true
      },
      {
        username: '철수',
        message: 'GPT',
        time: '2023-05-18T17:19',
        sentByUser: true
      },
      {
        username: '철수',
        message: 'world!',
        time: '2023-05-18T17:20',
        sentByUser: true
      },
      {
        username: 'GPT 3.5',
        message: 'Hi~',
        time: '2023-05-18T17:20',
        sentByUser: false
      },
      {
        username: 'GPT 3.5',
        message: '가나라머리ㅏㅁ ㅏㅓㅠㅜㄴ잏 ㅓㅣㅏㄱ 니아ㅜ피마ㅜㄱㄹ ㅣㅏㅁ얼 ㅣㅏㅁ덯;ㅁ ㅓㅣ;ㅏㅁ너디ㅑㄹ ㅓ먀;ㅠㅜㅁ;ㅣㅓㄷㄴㄹ먀;ㅗㅎ;ㅣ렁ㄹ미;ㅏ너4ㅐ샤홈뎔ㄴ;ㅣㅏㅓ해ㅑ;ㅁ돟애ㅑ푼;ㅣㅏ가나라머리ㅏㅁ ㅏㅓㅠㅜㄴ잏 ㅓㅣㅏㄱ 니아ㅜ피마ㅜㄱㄹ ㅣㅏㅁ얼 ㅣㅏㅁ덯;ㅁ ㅓㅣ;ㅏㅁ너디ㅑㄹ ㅓ먀;ㅠㅜㅁ;ㅣㅓㄷㄴㄹ먀;ㅗㅎ;ㅣ렁ㄹ미;ㅏ너4ㅐ샤홈뎔ㄴ;ㅣㅏㅓ해ㅑ;ㅁ돟애ㅑ푼;ㅣㅏ가나라머리ㅏㅁ ㅏㅓㅠㅜㄴ잏 ㅓㅣㅏㄱ 니아ㅜ피마ㅜㄱㄹ ㅣㅏㅁ얼 ㅣㅏㅁ덯;ㅁ ㅓㅣ;ㅏㅁ너디ㅑㄹ ㅓ먀;ㅠㅜㅁ;ㅣㅓㄷㄴㄹ먀;ㅗㅎ;ㅣ렁ㄹ미;ㅏ너4ㅐ샤홈뎔ㄴ;ㅣㅏㅓ해ㅑ;ㅁ돟애ㅑ푼;ㅣㅏ',
        time: '2023-05-18T17:20',
        sentByUser: false
      }
    ];

    for (let i = 0; i < exampleData.length; i++) {
      if (
        i === exampleData.length - 1 ||
        exampleData[i].time !== exampleData[i + 1].time ||
        exampleData[i].sentByUser !== exampleData[i + 1].sentByUser
      ) {
        exampleData[i].showTime = true;
      } else {
        exampleData[i].showTime = false;
      }
    }
    setMessages(exampleData);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '10px' }}>채팅 기록(프로토타입):</div>
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

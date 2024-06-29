import { axiosInstance, non_server_test } from './axiosInstance';

// 메시지 전송
export const sendMessage = async (chat_Message, role = 'user') => {
  if (non_server_test) {
    console.log('Mocking sendMessage');
    const mockResponse = {
      data: {
        chats: [
          { content: chat_Message, role: role, createdAt: new Date().toISOString() },
          { content: "AI 응답 메시지", role: "assistant", createdAt: new Date().toISOString() }
        ]
      }
    };
    return mockResponse.data.chats;
  }

  let messageContent;

  if (typeof chat_Message === 'object' && chat_Message !== null) {
    messageContent = chat_Message.content;
  } else {
    messageContent = chat_Message;
  }

  const message = {
    role: role,
    content: messageContent
  };

  try {
    const response = await axiosInstance.post(`/chat/new`, { message: message.content });
    return response.data.chats;
  } catch (error) {
    console.error('메시지 보내기 실패:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// 모든 채팅 기록 삭제
export const deleteAllChats = async () => {
  if (non_server_test) {
    console.log('Mocking deleteAllChats');
    return { message: 'OK', chats: [] }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.delete('/chat/delete-all-chats');
      return response.data;
    } catch (error) {
      console.error('모든 채팅 기록 삭제 실패:', error);
      throw error;
    }
  }
};

// 각 채팅 기록 불러오기
export const fetchMessages = async () => {
  if (non_server_test) {
    console.log('Mocking fetchMessages');
    const mockMessages = [
      { content: '안녕하세요?', role: 'user', createdAt: '2024-06-14T12:00:00.000Z' },
      { content: '무엇을 도와드릴까요?', role: 'assistant', createdAt: '2024-06-14T12:01:00.000Z' }
    ];
    return mockMessages;
  }

  try {
    console.log('Fetching messages...');
    const response = await axiosInstance.get('/chat/all-chats');
    console.log('Response:', response);
    return Array.isArray(response.data.chats) ? response.data.chats : [];
  } catch (error) {
    console.error('메시지 가져오기 실패:', error);
    return [];
  }
};

// 채팅방 기록 불러오기
export const fetchChatHistory = async () => {
  if (non_server_test) {
    return [
      { roomId: 'room1', lastMessage: '안녕하세요?', time: '2024-05-04T11:59' },
      { roomId: 'room2', lastMessage: '무슨 일이세요?', time: '2024-05-08T12:00' },
      { roomId: 'room3', lastMessage: '좋은 하루 되세요.', time: '2024-05-04T15:51' },
      { roomId: 'room4', lastMessage: '내일 뵙겠습니다.', time: '2024-05-10T15:51' }
    ]; // 테스트 데이터 반환
  } else {
    try {
      const response = await axiosInstance.get('/chat/history');
      return response.data || []; // 서버 응답 데이터 반환, 없을 경우 빈 배열 반환
    } catch (error) {
      console.error('채팅 기록 가져오기 실패:', error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  }
};

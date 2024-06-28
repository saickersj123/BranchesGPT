import axios from 'axios';

// 전역 변수 설정
const non_server_test = false; // true이면 항상 성공으로 처리, false이면 실제 서버와 통신

// 모든 요청에 withCredentials 옵션을 설정
axios.defaults.withCredentials = true;

// axios 인스턴스 생성. 모든 요청에 사용됩니다.
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api/', // API 요청의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 Content-Type을 application/json으로 설정
  },
  withCredentials: true, // 인스턴스 레벨에서 withCredentials 설정
});

// 응답 인터셉터 
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // 특정 요청에 대해 인터셉터 무시
      if (originalRequest.url.includes('/user/mypage')) {
        return Promise.reject(error);
      }
      // 인증 오류 발생 시 처리
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
    const response = await axiosInstance.post(`/chat/c/new`, { message: message.content });
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
      const response = await axiosInstance.delete('/chat/delete-all-c');
      return response.data;
    } catch (error) {
      console.error('모든 채팅 기록 삭제 실패:', error);
      throw error;
    }
  }
};

// 인증 상태 확인
export const checkAuthStatus = async () => {
  console.log('checkAuthStatus 호출');
  if (non_server_test) {
    return { valid: true };
  } else {
    try {
      const response = await axiosInstance.get('/user/auth-status');
      console.log('서버 응답:', response.data);
      if (response.data && response.data.message === "OK") {
        return { valid: true };
      } else {
        return { valid: false };
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      return { valid: false };
    }
  }
};

// 마이페이지에서 비밀번호 검증
export const mypage = async (password) => {
  if (non_server_test) {
    return { message: 'OK' };
  } else {
    try {
      const response = await axiosInstance.post('/user/mypage', { password });
      return response.data;
    } catch (error) {
      // 403 에러를 직접 처리
      if (error.response && error.response.status === 403) {
        return {
          message: "ERROR",
          cause: "Incorrect Password"
        };
      }
      console.error('비밀번호 인증 실패:', error);
      throw error;
    }
  }
};

// 로그인
export const loginUser = async (email, password) => {
  if (non_server_test) {
    const mockResponse = {
      success: true,
      message: "OK",
      data: {
        name: "사용자닉네임",
        email: "user@example.com",
        token: "mockToken"
      }
    };
    return mockResponse;
  } else {
    try {
      const response = await axiosInstance.post('/user/login', { email, password });
      if (response.status === 200) {
        return {
          success: true,
          message: "OK",
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || '로그인에 실패했습니다.'
        };
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      throw error;
    }
  }
};

// 로그아웃
export const logout = async () => {
  if (non_server_test) {
    console.log('로그아웃 성공'); // 항상 성공으로 처리
  } else {
    try {
      await axiosInstance.get('/user/logout');
    } catch (error) {
      console.error('로그아웃 실패:', error);
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
    const response = await axiosInstance.get('/chat/all-c');
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
      const response = await axiosInstance.get('/chat/c/:conversationId');
      return response.data || []; // 서버 응답 데이터 반환, 없을 경우 빈 배열 반환
    } catch (error) {
      console.error('채팅 기록 가져오기 실패:', error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  }
};

// 회원가입
export const signupUser = async (email, password, name) => {
  if (non_server_test) {
    console.log('회원가입 성공:', { email, password, name });
    return { success: true, message: '회원가입 성공', user: { email, name } }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/user/signup', { email, password, name });
      return {
        success: response.status === 201,
        ...response.data
      };
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }
};

// 비밀번호 재설정
export const resetPassword = async (email, newPassword) => {
  if (non_server_test) {
    return { success: true, message: '비밀번호 재설정 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/user/resetPassword', { email, newPassword });
      return response.data;
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      throw error;
    }
  }
};

// 닉네임 업데이트
export const updatename = async (name) => {
  if (non_server_test) {
    return { success: true, message: '닉네임 변경 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.put('/user/update-name', { name });
      return response.data; // 서버 응답을 반환
    } catch (error) {
      throw new Error('닉네임 변경에 실패했습니다.');
    }
  }
};

// 비밀번호 업데이트
export const updatePassword = async (password) => {
  if (non_server_test) {
    return { success: true, message: '비밀번호 변경 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.put('/user/update-password', { password });
      return response.data; // 서버 응답을 반환 
    } catch (error) {
      throw new Error('비밀번호 변경에 실패했습니다.');
    }
  }
};

export default axiosInstance; // 모듈에서 axios 인스턴스를 기본값으로 내보냅니다.

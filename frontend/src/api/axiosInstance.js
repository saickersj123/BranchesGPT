/*
  /src/api/axiosInstance.js
*/

import axios from 'axios';

// 모든 요청에 withCredentials 옵션을 설정
axios.defaults.withCredentials = true;

// axios 인스턴스 생성. 모든 요청에 사용됩니다.
const axiosInstance = axios.create({
  //for local testing
  baseURL:  process.env.REACT_APP_API_BASE_URL ,
  //for deployment
  //baseURL:  'https://api.branchesgpt.o-r.kr/api' , // API 요청의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 Content-Type을 application/json으로 설정
  },
  withCredentials: true, // 인스턴스 레벨에서 withCredentials 설정
});
 
export const sendMessage = async (conversationId, messageContent, role = 'user') => {
  const message = {
    role: role,
    content: messageContent,
  };

  try {
    const response = await axiosInstance.post(`/chat/c/${conversationId}`, { message : message.content });
    return response.data.chats;
  } catch (error) {
    console.error('메시지 보내기 실패:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// ID를 사용한 개별 채팅방 삭제
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.delete(`/chat/c/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('대화 삭제 실패:', error);
    throw error;
  }
};

// 모든 채팅 기록 삭제
export const deleteAllChats = async () => { 
    try {
      const response = await axiosInstance.delete('/chat/all-c');
      return response.data;
    } catch (error) {
      console.error('모든 채팅 기록 삭제 실패:', error);
      throw error;
    } 
};

// 인증 상태 확인
export const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get('/user/auth-status');
      if (response.data && response.data.message === "OK") {
        return { valid: true, user: { name: response.data.name } }; // 유저 이름 포함
      } else {
        return { valid: false };
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      return { valid: false }; 
   }
};

// 마이페이지에서 비밀번호 검증
export const mypage = async (password) => { 
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
};

// 새로운 대화 시작
export const startNewConversation = async ( ) => {
  try {
    const response = await axiosInstance.get('/chat/c/new');
    return response.data.conversation.id;
  } catch (error) {
    if (error.response) {
      // Log detailed error
      console.error('새로운 대화 시작 실패:', error.response.data);
      throw new Error(error.response.data.cause || '새로운 대화 시작에 실패했습니다.');
    } else {
      console.error('새로운 대화 시작 실패:', error.message);
      throw error;
    }
  }
};

// 새로운 대화 시작
export const startNewConversationwithmsg = async ( messageContent, role = 'user' ) => {
  const message = {
    role: role,
    content: messageContent,
  };
  try {
    const response = await axiosInstance.post('/chat/c/new', {message: message.content});
    return response.data.conversation;
  } catch (error) {
    if (error.response) {
      // Log detailed error
      console.error('새로운 대화 시작 실패:', error.response.data);
      throw new Error(error.response.data.cause || '새로운 대화 시작에 실패했습니다.');
    } else {
      console.error('새로운 대화 시작 실패:', error.message);
      throw error;
    }
  }
};

// 로그인
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/user/login', { email, password });
    if (response.status === 200 && response.data.message === "OK") {
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
    return {
      success: false,
      message: '로그인에 실패했습니다.',
      error: error.message
    };
  }
};

// 로그아웃
export const logout = async () => { 
  try {
    const response = await axiosInstance.get('/user/logout');
    if (response.data.message === "OK" || response.status === 200 || response.status === 304) { 
      return true;
    } else {
      console.error('로그아웃 실패:', response.data);
      return false;
    }
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return false;
  } 
};

// 모든 대화 목록 가져오기
export const fetchConversations = async () => {
  try {
    const response = await axiosInstance.get('/chat/all-c');
    const conversations = response.data.conversations || [];
    conversations.forEach(conversation => {
    });
    return conversations;
  } catch (error) {
    console.error('대화 목록 가져오기 실패:', error);
    return [];
  }
};

// id를 통해 채팅 기록을 불러오기
export const fetchMessages = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/chat/c/${conversationId}`);
    return response.data.conversation.chats || [];
  } catch (error) {
    console.error('메시지 가져오기 실패:', error);
    return [];
  }
};
 

// 회원가입
export const signupUser = async (email, password, name) => { 
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
};

// 비밀번호 재설정
export const resetPassword = async (email, newPassword) => { 
    try {
      const response = await axiosInstance.post('/user/resetPassword', { email, newPassword });
      return response.data;
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      throw error;
    } 
};

// 닉네임 업데이트
export const updatename = async (name) => { 
    try {
      const response = await axiosInstance.put('/user/update-name', { name });
      return response.data; // 서버 응답을 반환
    } catch (error) {
      throw new Error('닉네임 변경에 실패했습니다.');
    } 
};

// 비밀번호 업데이트
export const updatePassword = async (password) => { 
    try {
      const response = await axiosInstance.put('/user/update-password', { password });
      return response.data; // 서버 응답을 반환 
    } catch (error) {
      throw new Error('비밀번호 변경에 실패했습니다.');
    } 
};

// 사전학습 모델 생성
export const createModel = async (modelName, trainingData) => {
  try {
    
    const response = await axiosInstance.post('/chat/g/create', {
      modelName,
      trainingData
    });
    return response.data;
  } catch (error) {
    console.error('모델 생성 실패:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Custom Model 삭제 함수
export const deleteModel = async (modelId) => {
  try {
    const response = await axiosInstance.delete(`/chat/g/${modelId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 모든 커스텀 모델의 정보를 가지고 오는 것
export const getCustomModels = async () => {
  try {
    const response = await axiosInstance.get('/chat/all-g');  
    return response.data.CustomModels;
  } catch (error) {
    throw error;
  }
};


// 좌표값 가져오기
export const getChatboxes = async () => {
  try {
    const response = await axiosInstance.get('/user/cbox');
    const chatboxes = response.data.chatboxes; 
    // 가장 최근의 chatbox 찾기
    
    const latestChatbox = chatboxes.reduce((latest, current) => {
      return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current;
    }, chatboxes[0]);

    return latestChatbox;
  } catch (error) {
    console.error('좌표값 가져오기 실패:', error);
    throw error;
  }
};

// 좌표값 저장하기
export const saveChatbox = async (chatbox) => {
  try {
    const response = await axiosInstance.post('/user/cbox', chatbox);
    return response.data;
  } catch (error) {
    console.error('좌표값 저장하기 실패:', error);
    throw error;
  }
};

// 좌표값 초기화하기 
export const resetChatbox = async () => {
  try {
    const response = await axiosInstance.put('/user/cbox/reset');
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('응답 오류:', error.response.data);
    } else if (error.request) {
      // 요청이 전송되었으나 응답이 없는 경우
      console.error('요청 오류:', error.request);
    } else {
      // 요청을 설정하는 도중에 발생한 오류
      console.error('설정 오류:', error.message);
    }
    throw error;
  }
};
export default axiosInstance; // 모듈에서 axios 인스턴스를 기본값으로 내보냅니다.

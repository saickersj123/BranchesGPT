import axios, { AxiosInstance } from 'axios';
import { Message, Conversation } from '../types';  // types.ts에서 Message와 Conversation을 import

// 모든 요청에 withCredentials 옵션을 설정
axios.defaults.withCredentials = true;

// axios 인스턴스 생성. 모든 요청에 사용됩니다.
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // API 요청의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 Content-Type을 application/json으로 설정
  },
  withCredentials: true, // 인스턴스 레벨에서 withCredentials 설정
});

// Conversation 인터페이스 제거 (이미 types.ts에서 import했으므로)

interface User {
  name: string;
}

interface AuthResponse {
  valid: boolean;
  user?: User;
}

interface ChatboxCoordinates {
  cbox_x: number;
  cbox_y: number;
  cbox_w: number;
  cbox_h: number;
}

export const sendMessage = async (conversationId: string, messageContent: string, role: string = 'user'): Promise<Message[]> => {
  const message: Message = {
    role: role,
    content: messageContent,
    createdAt: new Date().toISOString() // 현재 시간을 ISO 문자열로 추가
  };

  try {
    const response = await axiosInstance.post(`/chat/c/${conversationId}`, { message : message.content });
    return response.data.chats;
  } catch (error) {
    console.error('메시지 보내기 실패:', error);
    throw error;
  }
};

export const deleteConversation = async (conversationId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/chat/c/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('대화 삭제 실패:', error);
    throw error;
  }
};

export const deleteAllChats = async (): Promise<any> => { 
  try {
    const response = await axiosInstance.delete('/chat/all-c');
    return response.data;
  } catch (error) {
    console.error('모든 채팅 기록 삭제 실패:', error);
    throw error;
  } 
};

export const checkAuthStatus = async (): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.get('/user/auth-status');
    if (response.data && response.data.message === "OK") {
      return { valid: true, user: { name: response.data.name } };
    } else {
      return { valid: false };
    }
  } catch (error) {
    console.error('인증 상태 확인 실패:', error);
    return { valid: false }; 
  }
};

export const mypage = async (password: string): Promise<any> => { 
  try {
    const response = await axiosInstance.post('/user/mypage', { password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
      return {
        message: "ERROR",
        cause: "Incorrect Password"
      };
    }
    console.error('비밀번호 인증 실패:', error);
    throw error;
  } 
};

export const startNewConversation = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get('/chat/c/new');
    return response.data.conversation.id;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('새로운 대화 시작 실패:', error.response.data);
      throw new Error(error.response.data.cause || '새로운 대화 시작에 실패했습니다.');
    } else {
      console.error('새로운 대화 시작 실패:', error);
      throw error;
    }
  }
};

export const startNewConversationwithmsg = async (messageContent: string, role: string = 'user'): Promise<Conversation> => {
  const message: Message = {
    role: role,
    content: messageContent,
    createdAt: new Date().toISOString() // 현재 시간을 ISO 문자열로 추가
  };
  try {
    const response = await axiosInstance.post('/chat/c/new', {message: message.content});
    return response.data.conversation;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('새로운 대화 시작 실패:', error.response.data);
      throw new Error(error.response.data.cause || '새로운 대화 시작에 실패했습니다.');
    } else {
      console.error('새로운 대화 시작 실패:', error);
      throw error;
    }
  }
};

export const loginUser = async (email: string, password: string): Promise<any> => {
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
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export const logout = async (): Promise<boolean> => { 
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

export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await axiosInstance.get('/chat/all-c');
    return response.data.conversations.map((conv: any) => ({
      _id: conv._id,
      chats: conv.chats,
      createdAt: conv.createdAt
    })) || [];
  } catch (error) {
    console.error('대화 목록 가져오기 실패:', error);
    return [];
  }
};

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const response = await axiosInstance.get(`/chat/c/${conversationId}`);
    return response.data.conversation.chats || [];
  } catch (error) {
    console.error('메시지 가져오기 실패:', error);
    return [];
  }
};

export const signupUser = async (email: string, password: string, name: string): Promise<any> => { 
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

export const resetPassword = async (email: string, newPassword: string): Promise<any> => { 
  try {
    const response = await axiosInstance.post('/user/resetPassword', { email, newPassword });
    return response.data;
  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    throw error;
  } 
};

export const updatename = async (name: string): Promise<any> => { 
  try {
    const response = await axiosInstance.put('/user/update-name', { name });
    return response.data;
  } catch (error) {
    throw new Error('닉네임 변경에 실패했습니다.');
  } 
};

export const updatePassword = async (password: string): Promise<any> => { 
  try {
    const response = await axiosInstance.put('/user/update-password', { password });
    return response.data;
  } catch (error) {
    throw new Error('비밀번호 변경에 실패했습니다.');
  } 
};

export const createModel = async (modelName: string, trainingData: string): Promise<any> => {
  try {
    const response = await axiosInstance.post('/chat/g/create', {
      modelName,
      trainingData
    });
    return response.data;
  } catch (error) {
    console.error('모델 생성 실패:', error);
    throw error;
  }
};

export const deleteModel = async (modelId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/chat/g/${modelId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomModels = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/chat/all-g');  
    return response.data.CustomModels;
  } catch (error) {
    throw error;
  }
};

export const getChatboxes = async (): Promise<ChatboxCoordinates | null> => {
  try {
    const response = await axiosInstance.get('/user/cbox');
    const chatboxes = response.data.chatboxes; 
    
    if (chatboxes.length === 0) {
      return null;
    }
    
    // 가장 최근의 chatbox 찾기
    const latestChatbox = chatboxes.reduce((latest: any, current: any) => {
      return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current;
    }, chatboxes[0]);

    return latestChatbox;
  } catch (error) {
    console.error('좌표값 가져오기 실패:', error);
    throw error;
  }
};

export const saveChatbox = async (chatbox: ChatboxCoordinates): Promise<any> => {
  try {
    const response = await axiosInstance.post('/user/cbox', chatbox);
    return response.data;
  } catch (error) {
    console.error('좌표값 저장하기 실패:', error);
    throw error;
  }
};

export const resetChatbox = async (): Promise<any> => {
  try {
    const response = await axiosInstance.put('/user/cbox/reset');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('응답 오류:', error.response.data);
      } else if (error.request) {
        console.error('요청 오류:', error.request);
      } else {
        console.error('설정 오류:', error.message);
      }
    } else {
      console.error('알 수 없는 오류:', error);
    }
    throw error;
  }
};

export default axiosInstance;
import axios from 'axios';
  

// 모든 요청에 withCredentials 옵션을 설정
axios.defaults.withCredentials = true;

// axios 인스턴스 생성. 모든 요청에 사용됩니다.
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // API 요청의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 Content-Type을 application/json으로 설정
  },
  withCredentials: true, // 인스턴스 레벨에서 withCredentials 설정
});
 
// 메시지 전송
export const sendMessage = async (conversationId, messageContent, role = 'user') => {
  const message = {
    role: role,
    content: messageContent
  };

  try {
    const response = await axiosInstance.post(`/chat/c/${conversationId}`, { message: message.content });
    return response.data.chats;
  } catch (error) {
    console.error('메시지 보내기 실패:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// ID를 사용한 개별 채팅방 삭제
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.delete(`/chat/delete-c/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('대화 삭제 실패:', error);
    throw error;
  }
};

// 모든 채팅 기록 삭제
export const deleteAllChats = async () => { 
    try {
      const response = await axiosInstance.delete('/chat/delete-all-c');
      return response.data;
    } catch (error) {
      console.error('모든 채팅 기록 삭제 실패:', error);
      throw error;
    } 
};

// 인증 상태 확인
export const checkAuthStatus = async () => {
  console.log('checkAuthStatus 호출'); 
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
export const startNewConversation = async (messageContent) => {
  try {
    const response = await axiosInstance.post('/chat/c/new', { message: messageContent || 'Hi' });
    return response.data;
  } catch (error) {
    console.error('새로운 대화 시작 실패:', error.response ? error.response.data : error.message);
    throw error;
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
      console.log('Conversation ID:', conversation._id); // 콘솔 로그 추가
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
    console.log('Fetching messages for conversation:', conversationId);
    const response = await axiosInstance.get(`/chat/c/${conversationId}`);
    console.log('Response:', response);
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

export default axiosInstance; // 모듈에서 axios 인스턴스를 기본값으로 내보냅니다.

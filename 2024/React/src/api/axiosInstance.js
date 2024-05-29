// api/axiosInstance.js
import axios from 'axios';

// 전역 변수 설정
const non_server_test = true;  // true이면 항상 성공으로 처리, false이면 실제 서버와 통신

// axios 인스턴스 생성. 모든 요청에 사용됩니다.
const axiosInstance = axios.create({
  baseURL: '서버의 url을 적으면 되는 공간', // API 요청의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 Content-Type을 application/json으로 설정
  },
});

// 로그인 유지(?)상태 확인
export const checkAuthStatus = async () => {
  if (non_server_test) {
    return { valid: true }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.get('/user/auth-status');
      return response.data;
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      throw error;
    }
  }
};

// 서버에 로그인을 시도합니다.
export const loginUser = async (email, password) => {
  if (non_server_test) {
    return {
      success: true,
      message: "로그인 성공",
      data: {
        name: "사용자닉네임",
        email: "user@example.com"
      }
    }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/user/login', { email, password });
      return response.data; // 서버로부터 받은 응답 데이터를 반환합니다.
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      throw error;
    }
  }
};

// 서버에게 로그아웃을 알립니다.
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

// 서버DB에 있는 메시지 기록을 가져옵니다.
export const fetchMessages = async (non_server_test = false) => {
  if (non_server_test) {
    return [
      { text: '테스트 메시지 1', time: '2024-05-08T11:59', sentByUser: true, username: 'Client(User)' },
      { text: '테스트 메시지 2', time: '2024-05-08T12:00', sentByUser: false, username: 'GPT-3.5' },
      { text: '테스트 메시지 3', time: '2024-05-08T15:51', sentByUser: true, username: 'Client(User)' },
      { text: '테스트 메시지 4', time: '2024-05-08T15:51', sentByUser: false, username: 'GPT-3.5' }
    ]; // 테스트 데이터 반환
  } else {
    try {
      const response = await axiosInstance.get('/chat/messages'); // 메시지를 가져올 서버의 엔드포인트
      return response.data; // 서버 응답 데이터 반환
    } catch (error) {
      console.error('메시지 가져오기 실패:', error);
      throw error;
    }
  }
};

// 사용자로부터 입력 받은 메시지를 서버에 전송합니다.
export const sendMessage = async (message) => {
  if (non_server_test) {
    return { id: 3, text: message, time: '12:02', sentByUser: true }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/messages', { text: message, sentByUser: true }); // 사용자가 보낸 것으로 서버에 전송
      return response.data;
    } catch (error) {
      console.error('메시지 보내기 실패:', error);
      throw error;
    }
  }
};

// 회원가입의 과정에 있어 이메일 중복검사를 진행한다.
export const checkEmail = async (email) => {
  if (non_server_test) {
    return { available: true }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/check-email', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// 사용자를 회원가입 시킵니다.
export const signupUser = async (email, password, name) => {
  if (non_server_test) {
    console.log('회원가입 성공:', { email, password, name });
    return { success: true, message: '회원가입 성공', user: { email, name } }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/signup', { email, password, name });
      return response.data;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }
};

// 이메일로 인증 코드를 보냅니다.
export const sendVerificationCode = async (email) => {
  if (non_server_test) {
    return { success: true, message: '인증 코드 전송 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/sendVerificationCode', { email });
      return response.data;
    } catch (error) {
      console.error('인증 코드 보내기 실패:', error);
      throw error;
    }
  }
};

// 받은 인증 코드를 검증합니다.
export const verifyCode = async (email, code) => {
  if (non_server_test) {
    return { success: true, message: '코드 검증 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/verifyCode', { email, code });
      return response.data;
    } catch (error) {
      console.error('코드 검증 실패:', error);
      throw error;
    }
  }
};

// 사용자의 비밀번호를 재설정합니다.
export const resetPassword = async (email, newPassword) => {
  if (non_server_test) {
    return { success: true, message: '비밀번호 재설정 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/resetPassword', { email, newPassword });
      return response.data;
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      throw error;
    }
  }
};

// 닉네임 업데이트
export const updatename = async (newname) => {
  if (non_server_test) {
    return { success: true, message: '닉네임 변경 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.put('/update-name', { newname });
      return response.data;  // 서버 응답을 반환
    } catch (error) {
      throw new Error('닉네임 변경에 실패했습니다.');
    }
  }
};

// 비밀번호 업데이트
export const updatePassword = async (newPassword) => {
  if (non_server_test) {
    return { success: true, message: '비밀번호 변경 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.put('/update-password', { newPassword });
      return response.data;  // 서버 응답을 반환
    } catch (error) {
      throw new Error('비밀번호 변경에 실패했습니다.');
    }
  }
};

export default axiosInstance; // 모듈에서 axios 인스턴스를 기본값으로 내보냅니다.

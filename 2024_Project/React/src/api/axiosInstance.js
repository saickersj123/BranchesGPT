import axios from 'axios';


// 전역 변수 설정
const non_server_test = true; // true이면 항상 성공으로 처리, false이면 실제 서버와 통신

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

// 요청을 보낼 때마다 인증 토큰을 자동으로 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 응답 인터셉터를 추가하여 인증 오류를 처리
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // 인증 오류가 발생하면 로컬 스토리지에서 토큰을 제거하고 로그인 상태를 false로 설정
      localStorage.removeItem('authToken');
      sessionStorage.setItem('isLoggedIn', 'false');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


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



//로그인
export const loginUser = async (email, password) => {
  if (non_server_test) {
    const mockResponse = {
      success: true,
      message: "OK",
      data: {
        name: "사용자닉네임",
        email: "user@example.com",
        token: "mockToken" // 테스트 토큰 추가
      }
    };
    localStorage.setItem('authToken', mockResponse.data.token);
    return mockResponse;
  } else {
    try {
      const response = await axiosInstance.post('/user/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // 토큰 저장
      }
      return response.data;
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

// 각 룸별로 채팅 기록 불러오기
export const fetchMessages = async (roomId) => {
  if (non_server_test) {
    const testMessages = {
      room1: [
    { content: `안녕하세요, 무엇을 도와드릴까요? (1)`, time: '2024-05-08T11:59', role: "assistant" },
    { content: `저는 주문에 문제가 있어요. (1)`, time: '2024-05-08T12:00', role: "user" },
    { content: `어떤 문제가 있으신가요? (1)`, time: '2024-05-08T12:01', role: "assistant" },
    { content: `제가 주문한 상품이 아직 도착하지 않았어요. (1)`, time: '2024-05-08T12:03', role: "user" },
    { content: `주문 번호를 알려주시면 확인해드리겠습니다. (1)`, time: '2024-05-08T12:04', role: "assistant" },
    { content: `주문 번호는 123456 입니다. (1)`, time: '2024-05-08T12:05', role: "user" },
    { content: `주문을 확인 중입니다... (1)`, time: '2024-05-08T12:06', role: "assistant" },
    { content: `주문이 아직 배송 중인 것으로 확인되었습니다. 곧 도착할 예정입니다. (1)`, time: '2024-05-08T12:07', role: "assistant" },
    { content: `감사합니다. (1)`, time: '2024-05-08T12:08', role: "user" },
    { content: `더 도와드릴 것이 있나요? (1)`, time: '2024-05-08T12:09', role: "assistant" },
    { content: `아니요, 이만 할게요. 좋은 하루 되세요. (1)`, time: '2024-05-08T12:10', role: "user" },
    { content: `네, 감사합니다. 좋은 하루 되세요! (1)`, time: '2024-05-08T12:11', role: "assistant" }
  ],
  room2: [
    { content: `서비스에 대해 문의드리고 싶습니다. (2)`, time: '2024-05-08T12:01', role: "user" },
    { content: `어떤 서비스에 대해 궁금하신가요? (2)`, time: '2024-05-08T12:02', role: "assistant" },
    { content: `프리미엄 서비스에 대해 알고 싶습니다. (2)`, time: '2024-05-08T12:03', role: "user" },
    { content: `프리미엄 서비스는 다양한 혜택을 제공합니다. (2)`, time: '2024-05-08T12:04', role: "assistant" },
    { content: `자세한 내용을 알고 싶어요. (2)`, time: '2024-05-08T12:05', role: "user" },
    { content: `물론입니다. 프리미엄 서비스는... (2)`, time: '2024-05-08T12:06', role: "assistant" }
  ],
  room3: [
    { content: `좋은 하루 되세요! (3)`, time: '2024-05-04T15:51', role: "user" },
    { content: `감사합니다. 좋은 하루 되세요. (3)`, time: '2024-05-04T15:51', role: "assistant" }
  ],
  room4: [
    { content: `내일 뵙겠습니다. (4)`, time: '2024-05-10T15:51', role: "user" },
    { content: `네 내일 뵙겠습니다. (4)`, time: '2024-05-10T15:51', role: "assistant" }
  ]
    }
    return testMessages[roomId] || [];
  } else {
    try {
      const response = await axiosInstance.get(`/chat/${roomId}`);
      return response.data || [];
    } catch (error) {
      console.error('메시지 가져오기 실패:', error);
      return [];
    }
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
      const response = await axiosInstance.get('/chat/history'); // 채팅 기록을 가져올 서버의 엔드포인트
      return response.data || []; // 서버 응답 데이터 반환, 없을 경우 빈 배열 반환
    } catch (error) {
      console.error('채팅 기록 가져오기 실패:', error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  }
};

// 메시지 전송
export const sendMessage = async (chat_Message, chat_roomId) => {
  const Message = {
    content: chat_Message, // 메시지 내용을 content로 변경  
    role: "user" | "assistant", // 사용자가 보낸 메시지 역할 설정
    //-----미구현 범위-------------
    //roomId: chat_roomId //각각의 채팅방을 ID로 구분
  };
    try {
      if(non_server_test == 1){
        return { id: "user", text: chat_Message, time: '12:02', roomId: chat_roomId }; // 항상 성공으로 처리
      }
      const response = await axiosInstance.post(`/chat/new`, Message); // 메시지를 서버에 전송
      return response.data;
    } catch (error) {
      console.error('메시지 보내기 실패:', error);
      throw error;
    }
};



// 이메일 중복 검사
export const checkEmail = async (email) => {
  if (non_server_test) {
    return { available: true }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/user/check-email', { email });
      return response.data;
    } catch (error) {
      throw error;
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

// 인증 코드 전송
export const sendVerificationCode = async (email) => {
  if (non_server_test) {
    return { success: true, message: '인증 코드 전송 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/user/sendVerificationCode', { email });
      return response.data;
    } catch (error) {
      console.error('인증 코드 보내기 실패:', error);
      throw error;
    }
  }
};

// 인증 코드 검증
export const verifyCode = async (email, code) => {
  if (non_server_test) {
    return { success: true, message: '코드 검증 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post('/user/verifyCode', { email, code });
      return response.data;
    } catch (error) {
      console.error('코드 검증 실패:', error);
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
export const updatename = async (newname) => {
  if (non_server_test) {
    return { success: true, message: '닉네임 변경 성공' }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.put('/user/update-name', { newname });
      return response.data; // 서버 응답을 반환
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
      const response = await axiosInstance.put('/user/update-password', { newPassword });
      return response.data; // 서버 응답을 반환 
    } catch (error) {
      throw new Error('비밀번호 변경에 실패했습니다.');
    }
  }
};

export default axiosInstance; // 모듈에서 axios 인스턴스를 기본값으로 내보냅니다.

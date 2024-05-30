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

//각 룸별로 채팅기록 불러오기
export const fetchMessages = async (roomId) => {
  if (non_server_test) {
    const testMessages = {
      room1: [
        { text: `안녕하세요, 무엇을 도와드릴까요? (1)`, time: '2024-05-08T11:59', sentByUser: false, username: 'OPEN_AI_API' },
        { text: `저는 주문에 문제가 있어요. (1)`, time: '2024-05-08T12:00', sentByUser: true, username: 'Client(User)' },
        { text: `어떤 문제가 있으신가요? (1)`, time: '2024-05-08T12:01', sentByUser: false, username: 'OPEN_AI_API' },
        { text: `제가 주문한 상품이 아직 도착하지 않았어요. (1)`, time: '2024-05-08T12:03', sentByUser: true, username: 'Client(User)' },
        { text: `주문 번호를 알려주시면 확인해드리겠습니다. (1)`, time: '2024-05-08T12:04', sentByUser: false, username: 'OPEN_AI_API' },
        { text: `주문 번호는 123456 입니다. (1)`, time: '2024-05-08T12:05', sentByUser: true, username: 'Client(User)' },
        { text: `주문을 확인 중입니다... (1)`, time: '2024-05-08T12:06', sentByUser: false, username: 'OPEN_AI_API' },
        { text: `주문이 아직 배송 중인 것으로 확인되었습니다. 곧 도착할 예정입니다. (1)`, time: '2024-05-08T12:07', sentByUser: false, username: 'OPEN_AI_API' },
        { text: `감사합니다. (1)`, time: '2024-05-08T12:08', sentByUser: true, username: 'Client(User)' },
        { text: `더 도와드릴 것이 있나요? (1)`, time: '2024-05-08T12:09', sentByUser: false, username: 'OPEN_AI_API' },
        { text: `아니요, 이만 할게요. 좋은 하루 되세요. (1)`, time: '2024-05-08T12:10', sentByUser: true, username: 'Client(User)' },
        { text: `네, 감사합니다. 좋은 하루 되세요! (1)`, time: '2024-05-08T12:11', sentByUser: false, username: 'OPEN_AI_API' }
      ],
      room2: [
        { text: `서비스에 대해 문의드리고 싶습니다. (2)`, time: '2024-05-08T12:01', sentByUser: true, username: 'Client(User)' },
        { text: `어떤 서비스에 대해 궁금하신가요? (2)`, time: '2024-05-08T12:02', sentByUser: false, username: 'OPEN_AI_API' },
        { text: `프리미엄 서비스에 대해 알고 싶습니다. (2)`, time: '2024-05-08T12:03', sentByUser: true, username: 'Client(User)' },
        { text: `프리미엄 서비스는 다양한 혜택을 제공합니다. (2)`, time: '2024-05-08T12:04', sentByUser: false, username: 'OPEN_AI_API' },
        { text: `자세한 내용을 알고 싶어요. (2)`, time: '2024-05-08T12:05', sentByUser: true, username: 'Client(User)' },
        { text: `물론입니다. 프리미엄 서비스는... (2)`, time: '2024-05-08T12:06', sentByUser: false, username: 'OPEN_AI_API' }
      ],
      room3: [
        { text: `좋은 하루 되세요! (3)`, time: '2024-05-04T15:51', sentByUser: true, username: 'Client(User)' },
        { text: `감사합니다. 좋은 하루 되세요. (3)`, time: '2024-05-04T15:51', sentByUser: false, username: 'OPEN_AI_API' }
      ],
      room4: [
        { text: `내일 뵙겠습니다. (4)`, time: '2024-05-10T15:51', sentByUser: true, username: 'Client(User)' },
        { text: `네 내일 뵙겠습니다. (4)`, time: '2024-05-10T15:51', sentByUser: false, username: 'OPEN_AI_API' }
      ]
    };

    return testMessages[roomId] || []; // 해당 roomId의 테스트 데이터 반환
  } else {
    try {
      const response = await axiosInstance.get(`/chat/${roomId}`); // 메시지를 가져올 서버의 엔드포인트
      return response.data; // 서버 응답 데이터 반환
    } catch (error) {
      console.error('메시지 가져오기 실패:', error);
      throw error;
    }
  }
};



// 과거에 채팅했던 채팅방들을 사이드바로 불러오는 기능
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
      return response.data; // 서버 응답 데이터 반환
    } catch (error) {
      console.error('채팅 기록 가져오기 실패:', error);
      throw error;
    }
  }
};

// 사용자가 입력한 메시지를 서버로 전송
export const sendMessage = async (chat_Message, user_Email, roomId) => {
  const Message = {
    text: chat_Message,
    email: user_Email,
    sentByUser: true,  // 사용자가 보낸 메시지므로, sentByUser는 true가 된다.
    roomId: roomId    // 메시지 전송 시 roomId 포함
  };
  if (non_server_test) {
    return { id: Message.email, text: Message.text, time: '12:02', sentByUser: true, roomId: roomId }; // 항상 성공으로 처리
  } else {
    try {
      const response = await axiosInstance.post(`/chat/${roomId}/new`, Message); // 사용자가 보낸 것으로 서버에 전송
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
      const response = await axiosInstance.post('/user/check-email', { email });
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
      const response = await axiosInstance.post('/user/signup', { email, password, name });
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
      const response = await axiosInstance.post('/user/sendVerificationCode', { email });
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
      const response = await axiosInstance.post('/user/verifyCode', { email, code });
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
      const response = await axiosInstance.put('/user/update-password', { newPassword });
      return response.data;  // 서버 응답을 반환
    } catch (error) {
      throw new Error('비밀번호 변경에 실패했습니다.');
    }
  }
};

export default axiosInstance; // 모듈에서 axios 인스턴스를 기본값으로 내보냅니다.

/*

*/

import axios from 'axios';

// axios 인스턴스 생성. 모든 요청에 사용됩니다.
const axiosInstance = axios.create({
  baseURL: '서버의 url을 적으면 되는 공간', // API 요청의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 Content-Type을 application/json으로 설정
  },
});

//-----------------------Login.js
// 서버에 로그인을 시도합니다.
export const loginUser = async (email, password) => {
  try {
    /* -------아직 서버가 없으므로 임시주석처리, 나중에 서버를 연결하면 주석을 삭제
    const response = await axiosInstance.post('/user/login', {
      email,
      password
    });
    return response.data; // 서버로부터 받은 응답 데이터를 반환합니다.
    */
    // 개발/테스트 단계에서 항상 로그인 성공으로 처리
    const response = {
      data: {
        "success": true,
        "message": "로그인 성공",
        "data": {
          "name": "사용자닉네임",
          "email": "user@example.com"
        }
      }
    };
    // 로그인 처리가 성공적이라고 가정하고 응답 데이터를 반환
    return response.data;
  } catch (error) {
    console.error('로그인 요청 실패:', error);
    throw error; // 에러를 다시 호출자에게 전달합니다.
  }
  //여기에 로그인변수를 참으로 하도록 해줘
};

//-----------------------Navigation.js
// 서버에게 로그아웃을 알립니다.
export const logout = async () => {
  try {
    await axiosInstance.get('/logout');
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};

//-----------------------ChatList.js
// 메시지 목록을 서버에서 가져옵니다.
export const fetchMessages = async () => {
  try {
    const response = await axiosInstance.get('/messages'); // 메시지를 가져올 서버의 엔드포인트
    const data = response.data;

    // 메시지에 시간 표시 여부를 결정하는 로직
    for (let i = 0; i < data.length; i++) {
      if (
        i === data.length - 1 ||
        data[i].time !== data[i + 1].time ||
        data[i].sentByUser !== data[i + 1].sentByUser
      ) {
        data[i].showTime = true;
      } else {
        data[i].showTime = false;
      }
    }
    return data;
  } catch (error) {
    console.error('메시지 가져오기 실패:', error);
    throw error;
  }
};

//-----------------------ChatBox.js
// 사용자로부터 입력 받은 메시지를 서버에 전송합니다.
export const sendMessage = async (message) => {
  try {
    const response = await axiosInstance.post('/messages', { text: message, sentByUser: true }); // 사용자가 보낸 것으로 서버에 전송
    return response.data;
  } catch (error) {
    console.error('메시지 보내기 실패:', error);
    throw error;
  }
};

//-----------------------NewSignup.js
// 회원가입의 과정에 있어 이메일 중복검사를 진행한다.
export const checkEmail = async (email) => {
  try {
    // 실제 API 호출을 주석 처리
    // const response = await axiosInstance.post('/check-email', { email });
    // return response.data;

    // 테스트 단계에서는 항상 성공 응답 반환
    return { available: true };
  } catch (error) {
    throw error;
  }
};


//-----------------------NewSignup.js
// 사용자를 회원가입 시킵니다.
export const signupUser = async (email, password, name) => {
  try {
    // const response = await axiosInstance.post('/signup', {
    //   email,
    //   password,
    //   name,
    // });
    // return response.data;
    
    // 서버 통신을 주석처리하고 성공하도록 수정
    console.log('회원가입 성공:', { email, password, name });
    return { success: true, message: '회원가입 성공', user: { email, name } };
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};


//-----------------------PasswordReset.js
// 이메일로 인증 코드를 보냅니다.
export const sendVerificationCode = async (email) => {
  try {
    const response = await axiosInstance.post('/sendVerificationCode', { email });
    return response.data;
  } catch (error) {
    console.error('인증 코드 보내기 실패:', error);
    throw error;
  }
};

//-----------------------PasswordReset.js
// 받은 인증 코드를 검증합니다.
export const verifyCode = async (email, code) => {
  try {
    const response = await axiosInstance.post('/verifyCode', { email, code });
    return response.data;
  } catch (error) {
    console.error('코드 검증 실패:', error);
    throw error;
  }
};

//-----------------------PasswordReset.js
// 사용자의 비밀번호를 재설정합니다.
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axiosInstance.post('/resetPassword', { email, newPassword });
    return response.data;
  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    throw error;
  }
};

//-----------------------MyPage.js
// 닉네임 업데이트
export const updatename = async (newname) => {
  try {
    const response = await axiosInstance.put('/update-name', { newname });
    return response.data;  // 서버 응답을 반환
  } catch (error) {
    throw new Error('닉네임 변경에 실패했습니다.');
  }
};

//-----------------------MyPage.js
// 비밀번호 업데이트
export const updatePassword = async (newPassword) => {
  try {
    const response = await axiosInstance.put('/update-password', { newPassword });
    return response.data;  // 서버 응답을 반환
  } catch (error) {
    throw new Error('비밀번호 변경에 실패했습니다.');
  }
}; 


export default axiosInstance; // 모듈에서 axios 인스턴스를 기본값으로 내보냅니다.

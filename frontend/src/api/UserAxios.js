import { axiosInstance, non_server_test } from './axiosInstance';


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
      console.error('닉네임 변경 오류:', error.response || error.message);
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

import axios from 'axios';

// 전역 변수 설정
const non_server_test = false; // true이면 항상 성공으로 처리, false이면 실제 서버와 통신

// 모든 요청에 withCredentials 옵션을 설정
axios.defaults.withCredentials = true;

// axios 인스턴스 생성. 모든 요청에 사용됩니다.
const axiosInstance = axios.create({
  baseURL: 'https://branches-gpt-server.onrender.com/api', // API 요청의 기본 URL 설정
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
      if (window.location.pathname !== '/user/login') {
        window.location.href = '/user/login';
      }
    }
    return Promise.reject(error);
  }
);

// 인증 상태 확인
export const checkAuthStatus = async () => {
  console.log('checkAuthStatus 호출');
  if (non_server_test) {
    return { valid: true, name: "사용자닉네임", email: "user@example.com" };
  } else {
    try {
      const response = await axiosInstance.get('/user/auth-status');
      console.log('서버 응답:', response.data);
      if (response.data && response.data.message === "OK") {
        return { valid: true, name: response.data.name, email: response.data.email };
      } else {
        return { valid: false };
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      return { valid: false };
    }
  }
};

export { axiosInstance, non_server_test };

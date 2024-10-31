import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/axiosInstance';
import '../css/Login.css';
import branchImage from '../img/PRlogo2.png';

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<{ name: string } | null>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUser }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const isPasswordValid = password.length >= 8 && password.length <= 15;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError('이메일을 입력하세요.');
      return;
    }

    if (!password) {
      setError('비밀번호를 입력하세요.');
      return;
    }

    if (!isPasswordValid) {
      setError('비밀번호는 8~15자리 입니다.');
      return;
    }

    setError(''); // Clear error message before trying to login

    try {
      const response = await loginUser(email, password);
      if (response.message === 'OK') {
        setIsLoggedIn(true);
        setUser(response.data); // 유저 정보 저장
        navigate('/chat');
      } else {
        setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
      }
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className='loginPage'>
      <div className="login-center-box">
        <div className='logininputGroup'>
          <img src={branchImage} alt="logo" onClick={() => navigate('/')}/>
        </div>
      </div>
      
      <div className="login-center-box">
        <form onSubmit={handleSubmit} className='form'>
          <div className='logininputGroup'>
            <label htmlFor='email' className='label'>이메일 주소</label>
            <input
              type='email'
              id='email'
              placeholder='이메일을 입력하세요'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='inputField'
            />
            <div className='underline'></div>
          </div>
          <div className='logininputGroup'>
            <label htmlFor='password' className='label'>비밀번호</label>
            <input
              type='password'
              id='password'
              placeholder='8~15자리의 비밀번호를 입력하세요'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='inputField'
            />
            <div className='underline'></div>
          </div>
          {error && <div className='error'>{error}</div>}
          <button className='LoginButton'>
            로그인
          </button>
          <div className='or'>or</div>
          <button className='SignupButton' type="button" onClick={() => navigate('/signup')}>
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
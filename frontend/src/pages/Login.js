import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import backgroundImage from '../img/login_background_image.png';
import Signup from '../components/NewSignup';
import PasswordReset from '../components/PasswordReset';
import { loginUser } from '../api/axiosInstance';
import '../css/Login.css'; // 로그인 페이지의 CSS 파일

const BackgroundContainer = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const StyledContainer = styled(Container)`
  max-width: 500px;
  padding: 20px;
  margin-top: 20vh;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #fff;
  transition: margin-top 0.5s ease;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;

const PasswordGroup = styled.div`
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s ease;

  ${(props) =>
    props.show &&
    css`
      max-height: 550px; // Adjusted to fit the content including the button
    `}
`;

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const navigate = useNavigate();

  const showPasswordInput = email.includes('@');
  const isPasswordValid = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('이메일을 입력하세요.');
      return;
    }

    if (!password) {
      setError('비밀번호를 입력하세요.');
      return;
    }

    if (!showPasswordInput) {
      setError('올바른 이메일 형식을 입력하세요.');
      return;
    }

    if (!isPasswordValid) {
      setError('비밀번호는 8~15자리 입니다.');
      return;
    }

    setLoading(true);
    setError(''); // Clear error message before trying to login
    try {
      const response = await loginUser(email, password);
      if (response.message === 'OK') {
        const { name, email, token } = response;
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('authToken', token); // 토큰 저장
        setTimeout(() => {
          setIsLoggedIn(true);
          navigate('/');
        }, 1000); // 로그인 성공 후 1초 후 홈 페이지로 이동
      } else {
        setError(response.cause || '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
        setLoading(false);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setError('서버를 찾을 수 없습니다.');
            break;
          case 409:
            setError('해당 정보로 가입된 계정이 없습니다.');
            break;
          case 422:
            setError('비밀번호가 올바르지 않습니다.');
            break;
          case 403:
            setError('비밀번호가 올바르지 않습니다.');
            break;
          default:
            setError('해당 정보로 가입된 계정이 없습니다.');
        }
      } else {
        setError('서버와의 통신 중 오류가 발생했습니다. 다시 시도하세요.');
      }
      setLoading(false);
    }
  };

  return (
    <BackgroundContainer>
      <StyledContainer>
        <h1>로그인</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <StyledForm onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>이메일 주소</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력하세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <PasswordGroup show={showPasswordInput}>
            <Form.Group controlId="formPassword">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="8~15자리의 비밀번호를 입력하세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <StyledButton variant="primary" type="submit" disabled={!isPasswordValid || loading}>
              {loading ? <Spinner animation="border" size="sm" /> : '로그인'}
            </StyledButton>
          </PasswordGroup>
        </StyledForm>

        <StyledButton variant="secondary" onClick={() => setShowSignupModal(true)}>
          회원가입
        </StyledButton>
        <StyledButton variant="link" onClick={() => setShowPasswordResetModal(true)}>
          비밀번호 찾기
        </StyledButton>

        {showSignupModal && <Signup show={showSignupModal} onHide={() => setShowSignupModal(false)} />}
        {showPasswordResetModal && <PasswordReset show={showPasswordResetModal} onHide={() => setShowPasswordResetModal(false)} />}
      </StyledContainer>
    </BackgroundContainer>
  );
};

export default Login;

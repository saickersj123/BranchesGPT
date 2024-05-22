import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import backgroundImage from '../img/login_background_image.png';
import Signup from '../components/NewSignup'; // Import the Signup component
import PasswordReset from '../components/PasswordReset'; // Import the PasswordReset component

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
  transition: margin-top 0.5s ease; /* Added transition for smoother appearance */
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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력하세요.');
      return;
    }

    setSuccess(true);
    setError('');

    setIsLoggedIn(true);

    await delay(1000);
    navigate('/');
  };

  const showPasswordField = () => {
    return email.indexOf('@') !== -1 && email.indexOf('.') !== -1;
  };

  return (
    <BackgroundContainer>
      <StyledContainer style={{ marginTop: showPasswordField() ? '10vh' : '20vh' }}> {/* Adjusted marginTop based on showPasswordField */}
        <h1>로그인</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">로그인에 성공했습니다!</Alert>}
        <StyledForm onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>이메일 주소</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력하세요."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailEntered(showPasswordField()); // Update isEmailEntered based on showPasswordField
              }}
            />
          </Form.Group>

          {showPasswordField() && ( // Render password field only if showPasswordField is true
            <Form.Group controlId="formPassword">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력하세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          )}

          <StyledButton variant="primary" type="submit" disabled={!showPasswordField()}> {/* Disable login button until showPasswordField is true */}
            로그인
          </StyledButton>
          <StyledButton variant="secondary" onClick={() => setShowSignupModal(true)}>
            회원가입
          </StyledButton>
          <StyledButton variant="link" onClick={() => setShowPasswordResetModal(true)}>
            비밀번호 찾기
          </StyledButton>
        </StyledForm>

        <Signup show={showSignupModal} onHide={() => setShowSignupModal(false)} />
        <PasswordReset show={showPasswordResetModal} onHide={() => setShowPasswordResetModal(false)} />
      </StyledContainer>
    </BackgroundContainer>
  );
};

export default Login;

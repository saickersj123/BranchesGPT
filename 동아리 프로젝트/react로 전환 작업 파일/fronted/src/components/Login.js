/*
    추후 이메일 인증을 사용한 비밀번호 초기화
*/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';

// 스타일 정의
const StyledContainer = styled(Container)`
  max-width: 500px;
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  background-color: #fff;
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
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSuccess, setResetEmailSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
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

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setResetError('이메일을 입력하세요.');
      return;
    }

    setResetEmailSuccess(true);
    setResetError('');
    setIsVerified(true);

    await delay(1000);
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setResetError('새 비밀번호를 입력하세요.');
      return;
    }

    setPasswordResetSuccess(true);
    setResetError('');
    setShowPasswordResetModal(false);

    await delay(1000);
  };

  return (
    <StyledContainer>
      <h1>로그인</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">로그인에 성공했습니다!</Alert>}
      <StyledForm onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>이메일 주소</Form.Label>
          <Form.Control
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <StyledButton variant="primary" type="submit">
          로그인
        </StyledButton>
        <StyledButton variant="secondary" onClick={() => setShowSignupModal(true)}>
          회원가입
        </StyledButton>
        <StyledButton variant="link" onClick={() => setShowPasswordResetModal(true)}>
          비밀번호 찾기
        </StyledButton>
      </StyledForm>

      <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>회원가입</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledForm onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>이메일 주소</Form.Label>
              <Form.Control
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formNickname">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </Form.Group>

            <StyledButton variant="primary" type="submit">
              회원가입
            </StyledButton>
          </StyledForm>
        </Modal.Body>
      </Modal>

      <Modal show={showPasswordResetModal} onHide={() => setShowPasswordResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 찾기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isVerified ? (
            <StyledForm onSubmit={handlePasswordResetSubmit}>
              <Form.Group controlId="formResetEmail">
                <Form.Label>이메일 주소</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </Form.Group>

              <StyledButton variant="primary" type="submit">
                비밀번호 재설정
              </StyledButton>
              {resetError && <Alert variant="danger" className="mt-3">{resetError}</Alert>}
              {resetEmailSuccess && <Alert variant="success" className="mt-3">이메일 인증이 성공했습니다.</Alert>}
            </StyledForm>
          ) : (
            <StyledForm onSubmit={handleNewPasswordSubmit}>
              <Form.Group controlId="formNewPassword">
                <Form.Label>새 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>

              <StyledButton variant="primary" type="submit">
                비밀번호 재설정
              </StyledButton>
              {resetError && <Alert variant="danger" className="mt-3">{resetError}</Alert>}
              {passwordResetSuccess && <Alert variant="success" className="mt-3">비밀번호가 성공적으로 변경되었습니다.</Alert>}
            </StyledForm>
          )}
        </Modal.Body>
      </Modal>
    </StyledContainer>
  );
};

export default Login;

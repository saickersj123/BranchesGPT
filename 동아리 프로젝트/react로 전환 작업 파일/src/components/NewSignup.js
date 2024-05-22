// src/components/Signup.js

import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;

const Signup = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); // Correct state variable
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !nickname) {
      setError('모든 필드를 입력하세요.');
      return;
    }

    setSuccess(true);
    setError('');

    await delay(1000);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>회원가입</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">회원가입에 성공했습니다!</Alert>}
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
              onChange={(e) => setNickname(e.target.value)} // Correct function call
            />
          </Form.Group>

          <StyledButton variant="primary" type="submit">
            회원가입
          </StyledButton>
        </StyledForm>
      </Modal.Body>
    </Modal>
  );
};

export default Signup;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

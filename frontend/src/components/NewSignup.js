import React, { useState } from 'react';
import { Modal, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { signupUser } from '../api/axiosInstance';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8 && password.length <= 15;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setError('모든 필드를 입력하세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('유효한 이메일 주소를 입력하세요.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('8~15자리의 비밀번호를 입력하세요.');
      return;
    }

    try {
      const response = await signupUser(email, password, name);

      if (response.success) {
        setSuccess(true);
        setError('');
        await delay(1000); // 1초 지연 후 모달을 닫습니다.
        onHide();
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('이미 사용 중인 이메일입니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
      }
    }
  };

  return (
    <>
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
              <InputGroup>
                <Form.Control
                  type="password"
                  placeholder="8~15자리의 비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <InputGroup.Text>
                    {isValidPassword(password) ? (
                      <FaCheckCircle color="green" />
                    ) : (
                      <FaTimesCircle color="red" />
                    )}
                  </InputGroup.Text>
                )}
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formName">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                placeholder="닉네임을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <StyledButton variant="primary" type="submit">
              회원가입
            </StyledButton>
          </StyledForm>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Signup;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

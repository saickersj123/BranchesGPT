import React, { useState } from 'react';
import { Modal, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { signupUser, checkEmail } from '../api/axiosInstance';
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
  const [validate, setValidate] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [emailCheckSuccess, setEmailCheckSuccess] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8 && password.length <= 15;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidate(true);

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

    if (emailAvailable === false) {
      setError('이메일이 이미 사용 중입니다.');
      return;
    }

    try {
      const response = await signupUser(email, password, name);

      if (response.success) {
        setSuccess(true);
        setError('');
        setValidate(false);
        await delay(1000);
        onHide();
      } else {
        setError('회원가입에 실패했습니다. 다시 시도하세요.');
      }
    } catch (error) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
    }
  };

  const handleCheckEmail = async () => {
    if (!email) {
      setError('이메일을 입력하세요.');
      return;
    }

    try {
      const response = await checkEmail(email);
      setEmailAvailable(response.available);
      if (response.available) {
        setError('');
        setEmailCheckSuccess(true);
        setShowEmailModal(true);
      } else {
        setError('이메일이 이미 사용 중입니다.');
        setEmailCheckSuccess(false);
      }
    } catch (error) {
      setError('이메일 확인 중 오류가 발생했습니다. 다시 시도하세요.');
      setEmailCheckSuccess(false);
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
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailAvailable(null);
                    setEmailCheckSuccess(false);
                  }}
                  disabled={emailCheckSuccess}
                />
                <Button variant="outline-secondary" onClick={handleCheckEmail} disabled={emailCheckSuccess}>
                  중복확인
                </Button>
                {validate && email && (
                  <InputGroup.Text>
                    {emailAvailable === true ? (
                      <FaCheckCircle color="green" />
                    ) : emailAvailable === false ? (
                      <FaTimesCircle color="red" />
                    ) : null}
                  </InputGroup.Text>
                )}
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>비밀번호</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  placeholder="8~15자리의 비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={emailAvailable !== true}
                />
                {password && emailAvailable === true && (
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
                disabled={emailAvailable !== true}
              />
            </Form.Group>

            <StyledButton variant="primary" type="submit" disabled={emailAvailable !== true}>
              회원가입
            </StyledButton>
          </StyledForm>
        </Modal.Body>
      </Modal>

      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>이메일 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>사용 가능한 이메일입니다.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowEmailModal(false)}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Signup;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

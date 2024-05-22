// src/components/PasswordReset.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;

const PasswordReset = ({ show, onHide }) => {
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSuccess, setResetEmailSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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
    onHide();

    await delay(1000);
  };

  return (
    <Modal show={show} onHide={onHide}>
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
  );
};

export default PasswordReset;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
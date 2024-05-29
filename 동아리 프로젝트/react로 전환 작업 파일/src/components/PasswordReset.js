import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { sendVerificationCode, verifyCode, resetPassword } from '../api/axiosInstance'; // 함수를 가져옵니다.

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
  const [verificationCode, setVerificationCode] = useState('');

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setResetError('이메일을 입력하세요.');
      return;
    }

    try {
      await sendVerificationCode(resetEmail);
      setResetEmailSuccess(true);
      setResetError('');
    } catch (error) {
      setResetError('이메일 보내기에 실패했습니다.');
    }
  };

  const handleVerificationCodeSubmit = async (e) => {
    e.preventDefault();

    try {
      await verifyCode(resetEmail, verificationCode);
      setIsVerified(true);
      setResetError('');
    } catch (error) {
      setResetError('인증코드 확인에 실패했습니다.');
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setResetError('새 비밀번호를 입력하세요.');
      return;
    }

    try {
      await resetPassword(resetEmail, newPassword);
      setPasswordResetSuccess(true);
      setResetError('');
      onHide();
    } catch (error) {
      setResetError('비밀번호 재설정에 실패했습니다.');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>비밀번호 찾기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isVerified ? (
          <>
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
              {resetEmailSuccess && <Alert variant="success" className="mt-3">이메일로 인증코드가 전송되었습니다.</Alert>}
            </StyledForm>
            <StyledForm onSubmit={handleVerificationCodeSubmit}>
              <Form.Group controlId="formVerificationCode">
                <Form.Label>인증코드</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="인증코드를 입력하세요"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </Form.Group>

              <StyledButton variant="primary" type="submit">
                인증코드 확인
              </StyledButton>
              {resetError && <Alert variant="danger" className="mt-3">{resetError}</Alert>}
            </StyledForm>
          </>
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

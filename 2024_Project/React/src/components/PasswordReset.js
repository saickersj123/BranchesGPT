import React, { useState } from 'react'; // React와 useState 훅을 가져옵니다.
import styled from 'styled-components'; // styled-components를 가져옵니다.
import { Modal, Form, Button, Alert } from 'react-bootstrap'; // react-bootstrap에서 필요한 컴포넌트를 가져옵니다.
import { sendVerificationCode, verifyCode, resetPassword } from '../api/axiosInstance'; // API 함수들을 가져옵니다.

const StyledForm = styled(Form)` // 스타일을 적용한 Form 컴포넌트를 정의합니다.
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledButton = styled(Button)` // 스타일을 적용한 Button 컴포넌트를 정의합니다.
  width: 100%;
  margin-top: 10px;
`;

const PasswordReset = ({ show, onHide }) => { // PasswordReset 컴포넌트를 정의합니다.
  const [resetEmail, setResetEmail] = useState(''); // 이메일 상태를 정의합니다.
  const [resetEmailSuccess, setResetEmailSuccess] = useState(false); // 이메일 전송 성공 상태를 정의합니다.
  const [resetError, setResetError] = useState(''); // 에러 메시지 상태를 정의합니다.
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 상태를 정의합니다.
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false); // 비밀번호 재설정 성공 상태를 정의합니다.
  const [isVerified, setIsVerified] = useState(false); // 이메일 인증 성공 상태를 정의합니다.
  const [verificationCode, setVerificationCode] = useState(''); // 인증코드 상태를 정의합니다.

  const handlePasswordResetSubmit = async (e) => { // 비밀번호 재설정 요청을 처리하는 비동기 함수입니다.
    e.preventDefault();

    if (!resetEmail) { // 이메일이 입력되지 않았을 때 에러 메시지를 설정합니다.
      setResetError('이메일을 입력하세요.');
      return;
    }

    try {
      await sendVerificationCode(resetEmail); // 이메일로 인증코드를 전송합니다.
      setResetEmailSuccess(true); // 이메일 전송 성공 상태를 true로 설정합니다.
      setResetError(''); // 에러 메시지를 초기화합니다.
    } catch (error) {
      setResetError('이메일 보내기에 실패했습니다.'); // 이메일 전송 실패 시 에러 메시지를 설정합니다.
    }
  };

  const handleVerificationCodeSubmit = async (e) => { // 인증코드 제출을 처리하는 비동기 함수입니다.
    e.preventDefault();

    try {
      await verifyCode(resetEmail, verificationCode); // 인증코드를 검증합니다.
      setIsVerified(true); // 인증 성공 상태를 true로 설정합니다.
      setResetError(''); // 에러 메시지를 초기화합니다.
    } catch (error) {
      setResetError('인증코드 확인에 실패했습니다.'); // 인증코드 검증 실패 시 에러 메시지를 설정합니다.
    }
  };

  const handleNewPasswordSubmit = async (e) => { // 새 비밀번호 제출을 처리하는 비동기 함수입니다.
    e.preventDefault();

    if (!newPassword) { // 새 비밀번호가 입력되지 않았을 때 에러 메시지를 설정합니다.
      setResetError('새 비밀번호를 입력하세요.');
      return;
    }

    try {
      await resetPassword(resetEmail, newPassword); // 새 비밀번호로 비밀번호를 재설정합니다.
      setPasswordResetSuccess(true); // 비밀번호 재설정 성공 상태를 true로 설정합니다.
      setResetError(''); // 에러 메시지를 초기화합니다.
      onHide(); // 모달을 닫습니다.
    } catch (error) {
      setResetError('비밀번호 재설정에 실패했습니다.'); // 비밀번호 재설정 실패 시 에러 메시지를 설정합니다.
    }
  };

  return (
    <Modal show={show} onHide={onHide}> {/* 비밀번호 재설정 모달을 렌더링합니다. */}
      <Modal.Header closeButton>
        <Modal.Title>비밀번호 찾기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isVerified ? ( // 이메일 인증이 완료되지 않았을 때의 폼을 렌더링합니다.
          <>
            <StyledForm onSubmit={handlePasswordResetSubmit}> {/* 비밀번호 재설정 요청 폼을 렌더링합니다. */}
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
              {resetError && <Alert variant="danger" className="mt-3">{resetError}</Alert>} {/* 에러 메시지를 렌더링합니다. */}
              {resetEmailSuccess && <Alert variant="success" className="mt-3">이메일로 인증코드가 전송되었습니다.</Alert>} {/* 성공 메시지를 렌더링합니다. */}
            </StyledForm>
            <StyledForm onSubmit={handleVerificationCodeSubmit}> {/* 인증코드 확인 폼을 렌더링합니다. */}
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
              {resetError && <Alert variant="danger" className="mt-3">{resetError}</Alert>} {/* 에러 메시지를 렌더링합니다. */}
            </StyledForm>
          </>
        ) : (
          <StyledForm onSubmit={handleNewPasswordSubmit}> {/* 새 비밀번호 설정 폼을 렌더링합니다. */}
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
            {resetError && <Alert variant="danger" className="mt-3">{resetError}</Alert>} {/* 에러 메시지를 렌더링합니다. */}
            {passwordResetSuccess && <Alert variant="success" className="mt-3">비밀번호가 성공적으로 변경되었습니다.</Alert>} {/* 성공 메시지를 렌더링합니다. */}
          </StyledForm>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PasswordReset; // PasswordReset 컴포넌트를 기본 내보내기로 설정합니다.

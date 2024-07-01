import React, { useState } from 'react'; // React와 useState 훅을 가져옵니다.
import { Modal, Form, Button, Alert, InputGroup } from 'react-bootstrap'; // react-bootstrap에서 필요한 컴포넌트를 가져옵니다.
import styled from 'styled-components'; // styled-components를 가져옵니다.
import { signupUser, checkEmail } from '../api/axiosInstance'; // signupUser와 checkEmail 함수를 가져옵니다.
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // FontAwesome 아이콘을 가져옵니다.

const StyledForm = styled(Form)` // 스타일을 적용한 Form 컴포넌트를 정의합니다.
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledButton = styled(Button)` // 스타일을 적용한 Button 컴포넌트를 정의합니다.
  width: 100%;
  margin-top: 10px;
`;

const Signup = ({ show, onHide }) => { // Signup 컴포넌트를 정의합니다.
  const [email, setEmail] = useState(''); // 이메일 상태를 정의합니다.
  const [password, setPassword] = useState(''); // 비밀번호 상태를 정의합니다.
  const [name, setName] = useState(''); // 닉네임 상태를 정의합니다.
  const [error, setError] = useState(''); // 에러 메시지 상태를 정의합니다.
  const [success, setSuccess] = useState(false); // 성공 메시지 상태를 정의합니다.
  const [validate, setValidate] = useState(false); // 검증 상태를 정의합니다.
  const [emailAvailable, setEmailAvailable] = useState(null); // 이메일 사용 가능 여부 상태를 정의합니다.
  const [emailCheckSuccess, setEmailCheckSuccess] = useState(false); // 이메일 확인 성공 여부 상태를 정의합니다.
  const [showEmailModal, setShowEmailModal] = useState(false); // 이메일 확인 모달 표시 상태를 정의합니다.

  const isValidEmail = (email) => { // 이메일 형식을 검증하는 함수를 정의합니다.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => { // 비밀번호 형식을 검증하는 함수를 정의합니다.
    return password.length >= 8 && password.length <= 15;
  };

  const handleSubmit = async (e) => { // 폼 제출을 처리하는 비동기 함수입니다.
    e.preventDefault();
    setValidate(true);

    if (!email || !password || !name) { // 모든 필드가 입력되었는지 확인합니다.
      setError('모든 필드를 입력하세요.');
      return;
    }

    if (!isValidEmail(email)) { // 이메일 형식을 검증합니다.
      setError('유효한 이메일 주소를 입력하세요.');
      return;
    }

    if (!isValidPassword(password)) { // 비밀번호 형식을 검증합니다.
      setError('8~15자리의 비밀번호를 입력하세요.');
      return;
    }

    if (emailAvailable === false) { // 이메일이 사용 중인지 확인합니다.
      setError('이메일이 이미 사용 중입니다.');
      return;
    }

    try {
      const response = await signupUser(email, password, name); // 회원가입 요청을 보냅니다.

      if (response.success) {
        setSuccess(true);
        setError('');
        setValidate(false);
        await delay(1000); // 1초 지연 후 모달을 닫습니다.
        onHide();
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
      }
    } catch (error) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}> {/* 회원가입 모달을 렌더링합니다. */}
        <Modal.Header closeButton>
          <Modal.Title>회원가입</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>} {/* 에러 메시지를 렌더링합니다. */}
          {success && <Alert variant="success">회원가입에 성공했습니다!</Alert>} {/* 성공 메시지를 렌더링합니다. */}
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
                    
                  }}
                  
                />
                
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
                
              />
            </Form.Group>

            <StyledButton variant="primary" type="submit" >
              회원가입
            </StyledButton>
          </StyledForm>
        </Modal.Body>
      </Modal>

     
    </>
  );
};

export default Signup; // Signup 컴포넌트를 기본 내보내기로 설정합니다.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // 지연 함수를 정의합니다.

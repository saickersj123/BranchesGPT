import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/axiosInstance';
import '../css/Signup.css';
import branchImage from '../img/PRlogo2.png';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return password.length >= 8 && password.length <= 15;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !name || !passwordConfirm) {
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

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await signupUser(email, password, name);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
        setError('');
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setError('이미 사용 중인 이메일입니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
      }
    }
  };

  return (
    <div className="signupPage">
      <div className="signup-center-box">
        <div className='signupinputGroup'>
          <img
            src={branchImage}
            alt="Logo"
            className="signupLogo"
            onClick={() => navigate('/')}
          />
        </div>
      </div>
      
      <div className="signup-center-box">
        {error && (
          <Alert variant="danger" className="signupAlert">
            <FaTimesCircle style={{ marginRight: '10px' }} />
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="signupAlert">
            <FaCheckCircle style={{ marginRight: '10px' }} />
            회원가입에 성공했습니다!
          </Alert>
        )}
        <Form className="signupForm" onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="signupInputGroup">
            <Form.Label className="signupLabel">이메일 주소</Form.Label>
            <Form.Control
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signupInputField"
            />
            <div className="signupUnderline"></div>
          </Form.Group>

          <Form.Group controlId="formPassword" className="signupInputGroup">
            <Form.Label className="signupLabel">비밀번호</Form.Label> 
            <Form.Control
              type="password"
              placeholder="8~15자리의 비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signupInputField"
            />
            <div className="signupUnderline"></div>
            {password && (
              <div className="signupPasswordIcon">
                {isValidPassword(password) ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="formPasswordConfirm" className="signupInputGroup">
            <Form.Label className="signupLabel">비밀번호 재확인</Form.Label>
            <Form.Control
              type="password"
              placeholder="8~15자리의 비밀번호를 입력하세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="signupInputField"
            />
            <div className="signupUnderline"></div>
            {passwordConfirm && (
              <div className="signupPasswordIcon">
                {password === passwordConfirm ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaTimesCircle color="red" />
                )}
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="formName" className="signupInputGroup">
            <Form.Label className="signupLabel">닉네임</Form.Label>
            <Form.Control
              type="text"
              placeholder="닉네임을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="signupInputField"
            />
            <div className="signupUnderline"></div>
          </Form.Group>

          <Button variant="primary" type="submit" className="signupButton">
            회원가입
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
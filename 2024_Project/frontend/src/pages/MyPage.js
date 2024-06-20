import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPen } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MyPage.css';
import { updatename, updatePassword, loginUser } from '../api/axiosInstance'; // loginUser 함수 추가

const MyPage = () => {
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [name, setname] = useState('');
  const [newname, setNewname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditingname, setIsEditingname] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [email, setEmail] = useState(''); // 이메일 상태 추가

  useEffect(() => {
    // 세션 스토리지에서 닉네임과 이메일을 가져옴
    const storedname = sessionStorage.getItem('name');
    const storedEmail = sessionStorage.getItem('email');
    if (storedname) {
      setname(storedname);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleVerifyPassword = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      // loginUser 함수를 사용하여 비밀번호 검증
      const response = await loginUser(email, password);
      if (response.message === 'OK') {
        setIsPasswordVerified(true);
      } else {
        alert('비밀번호가 일치하지 않습니다.');
        setPassword(''); // Clear the password input
      }
    } catch (error) {
      alert('비밀번호 검증에 실패했습니다.');
      setPassword(''); // Clear the password input
    }
  };

  const handleNewnameChange = (event) => {
    setNewname(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleEditname = () => {
    setIsEditingname(true);
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };

  const handleSaveNewname = async () => {
    if (newname.trim()) {
      try {
        await updatename(newname);
        setname(newname);
        sessionStorage.setItem('name', newname); // 세션 스토리지에 새로운 닉네임 저장
        setIsEditingname(false);
        setNewname('');
      } catch (error) {
        alert('닉네임 변경에 실패했습니다.');
      }
    } else {
      alert('새 닉네임을 입력하세요.');
    }
  };

  const handleSaveNewPassword = async () => {
    if (newPassword.trim()) {
      try {
        await updatePassword(newPassword);
        alert('새 비밀번호가 저장되었습니다.');
        setIsEditingPassword(false);
        setNewPassword('');
      } catch (error) {
        alert('비밀번호 변경에 실패했습니다.');
      }
    } else {
      alert('새 비밀번호를 입력하세요.');
    }
  };

  const handleCancelEditname = () => {
    setIsEditingname(false);
    setNewname('');
  };

  const handleCancelEditPassword = () => {
    setIsEditingPassword(false);
    setNewPassword('');
  };

  const handleCloseMyPage = () => {
    window.history.back();
  };

  return (
    <Container className="mypage-container">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Card className="center-box">
            <Card.Body>
              {!isPasswordVerified ? (
                <>
                  <Card.Title>비밀번호를 입력하세요</Card.Title>
                  <Form onSubmit={handleVerifyPassword}>
                    <Form.Group className="password-input-container">
                      <Form.Label className="password-label">비밀번호: </Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <Button type="submit" variant="primary">
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Button>
                    </Form.Group>
                  </Form>
                </>
              ) : (
                <>
                  <Card.Title>마이페이지</Card.Title>
                  <Form>
                    <Form.Group as={Row} className="name-section">
                      <Form.Label column sm={4}>현재 닉네임 :</Form.Label>
                      <Col sm={6}>
                        <Form.Control plaintext readOnly value={name} />
                      </Col>
                      <Col sm={2} className="text-right">
                      <Button onClick={handleEditname} variant="link">
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                      </Col>
                    </Form.Group>
                    {isEditingname && (
                      <Alert variant="secondary" className="edit-section">
                        <Form.Group>
                          <Form.Label>새 닉네임 :</Form.Label>
                          <Form.Control
                            type="text"
                            value={newname}
                            onChange={handleNewnameChange}
                          />
                        </Form.Group>
                        <Button onClick={handleSaveNewname} variant="primary" className="mt-3">저장</Button>
                        <Button onClick={handleCancelEditname} variant="secondary" className="mt-3 ml-2">닫기</Button>
                      </Alert>
                    )}
                    <Form.Group as={Row} className="password-section mt-4">
                      <Form.Label column sm={4}>비 밀 번 호 :</Form.Label>
                      <Col sm={6}>
                        <Form.Control plaintext readOnly value="********" />
                      </Col>
                      <Col sm={2} className="text-right">
                      <Button onClick={handleEditname} variant="link">
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                      </Col>
                    </Form.Group>
                    {isEditingPassword && (
                      <Alert variant="secondary" className="edit-section">
                        <Form.Group>
                          <Form.Label>새 비밀번호:</Form.Label>
                          <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                          />
                        </Form.Group>
                        <Button onClick={handleSaveNewPassword} variant="primary" className="mt-3">저장</Button>
                        <Button onClick={handleCancelEditPassword} variant="secondary" className="mt-3 ml-2">닫기</Button>
                      </Alert>
                    )}
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;
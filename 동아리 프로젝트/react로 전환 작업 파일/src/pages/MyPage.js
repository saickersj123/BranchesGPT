import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MyPage.css';

const MyPage = () => {
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [nickname, setNickname] = useState('User123');
  const [newNickname, setNewNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleVerifyPassword = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (password === '1234') {
      setIsPasswordVerified(true);
    } else {
      alert('현재 비밀번호가 일치하지 않습니다.');
      setPassword(''); // Clear the password input
    }
  };

  const handleNewNicknameChange = (event) => {
    setNewNickname(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleEditNickname = () => {
    setIsEditingNickname(true);
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };

  const handleSaveNewNickname = () => {
    if (newNickname.trim()) {
      setNickname(newNickname);
      setIsEditingNickname(false);
      setNewNickname('');
    } else {
      alert('새 닉네임을 입력하세요.');
    }
  };

  const handleSaveNewPassword = () => {
    if (newPassword.trim()) {
      alert('새 비밀번호가 저장되었습니다.');
      setIsEditingPassword(false);
      setNewPassword('');
    } else {
      alert('새 비밀번호를 입력하세요.');
    }
  };

  const handleCancelEditNickname = () => {
    setIsEditingNickname(false);
    setNewNickname('');
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
                  <Card.Title>현재 비밀번호를 입력하세요</Card.Title>
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
                    <Form.Group as={Row} className="nickname-section">
                      <Form.Label column sm={4}>현재 닉네임:</Form.Label>
                      <Col sm={6}>
                        <Form.Control plaintext readOnly value={nickname} />
                      </Col>
                      <Col sm={2} className="text-right">
                        <Button onClick={handleEditNickname} variant="secondary">수정</Button>
                      </Col>
                    </Form.Group>
                    {isEditingNickname && (
                      <Alert variant="secondary" className="edit-section">
                        <Form.Group>
                          <Form.Label>새 닉네임:</Form.Label>
                          <Form.Control
                            type="text"
                            value={newNickname}
                            onChange={handleNewNicknameChange}
                          />
                        </Form.Group>
                        <Button onClick={handleSaveNewNickname} variant="primary" className="mt-3">저장</Button>
                        <Button onClick={handleCancelEditNickname} variant="secondary" className="mt-3 ml-2">닫기</Button>
                      </Alert>
                    )}
                    <Form.Group as={Row} className="password-section mt-4">
                      <Form.Label column sm={4}>비밀번호 수정:</Form.Label>
                      <Col sm={8} className="text-right">
                        <Button onClick={handleEditPassword} variant="secondary">수정</Button>
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

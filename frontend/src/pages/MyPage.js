import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPen } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MyPage.css';
import { updatename, updatePassword, mypage } from '../api/axiosInstance';

const MyPage = ({ token }) => {
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isPasswordVerified) {
      const fetchUserData = async () => {
        try {
          const response = await mypage(password, token); // 서버에서 사용자 정보 가져오는 API 호출
          if (response.message === 'OK') {
            setName(response.name);
            setEmail(response.email);
          }
        } catch (error) {
          console.error('사용자 정보를 불러오는 중 오류가 발생했습니다.', error);
        }
      };
  
      fetchUserData();
    }
  }, [isPasswordVerified, password, token]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleVerifyPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await mypage(password, token); // 서버에서 비밀번호 검증
      setPassword('');
      if (response.message === 'OK') {
        setIsPasswordVerified(true);
      } else if (response.cause === 'Incorrect Password') {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert('비밀번호 검증 중 오류가 발생했습니다.');
    }
  };

  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };

  const handleSaveNewName = async () => {
    if (newName.trim()) {
      try {
        await updatename(newName, token);
        setName(newName);
        setIsEditingName(false);
        setNewName('');
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
        await updatePassword(newPassword, token);
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

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNewName('');
  };

  const handleCancelEditPassword = () => {
    setIsEditingPassword(false);
    setNewPassword('');
  };

  const handleCloseMyPage = () => {
    window.history.back();
  };

  return (
    <Container className="mypage-container" style={{ marginTop: '100px' }}>
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
                        <Button onClick={handleEditName} variant="link">
                          <FontAwesomeIcon icon={faPen} />
                        </Button>
                      </Col>
                    </Form.Group>
                    {isEditingName && (
                      <div className="edit-section">
                        <Form.Group>
                          <Form.Label>새 닉네임 :</Form.Label>
                          <Form.Control
                            type="text"
                            value={newName}
                            onChange={handleNewNameChange}
                          />
                        </Form.Group>
                        <Button onClick={handleSaveNewName} variant="primary" className="mt-3">저장</Button>
                        <Button onClick={handleCancelEditName} variant="secondary" className="mt-3 ml-2">닫기</Button>
                      </div>
                    )}
                    <Form.Group as={Row} className="password-section mt-4">
                      <Form.Label column sm={4}>비 밀 번 호 :</Form.Label>
                      <Col sm={6}>
                        <Form.Control plaintext readOnly value="********" />
                      </Col>
                      <Col sm={2} className="text-right">
                        <Button onClick={handleEditPassword} variant="link">
                          <FontAwesomeIcon icon={faPen} />
                        </Button>
                      </Col>
                    </Form.Group>
                    {isEditingPassword && (
                      <div className="edit-section">
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
                      </div>
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

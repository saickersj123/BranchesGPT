// MyPage.js

import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPen, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/MyPage.css';
import { updatename, updatePassword, mypage } from '../api/axiosInstance';
import branchImage from '../img/PRlogo2.png'; // import the image

const MyPage = () => { 
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [name, setname] = useState('');
  const [newname, setNewname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditingname, setIsEditingname] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isNewnameFocused, setIsNewnameFocused] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleVerifyPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await mypage(password); // 서버에서 비밀번호 검증
      setPassword('');
      if (response.message === 'OK') {
        setIsPasswordVerified(true);
        setname(response.name);
      } else if (response.cause === 'Incorrect Password') {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert('비밀번호 검증 중 오류가 발생했습니다.');
    }
  };

  const handleNewnameChange = (event) => {
    setNewname(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleEditname = () => {
    setIsEditingPassword(false);
    setIsEditingname(true);
  };

  const handleEditPassword = () => {
    setIsEditingname(false);
    setIsEditingPassword(true);
  };

  const handleSaveNewname = async () => {
    if (newname.trim()) {
      try {
        await updatename(newname);
        setname(newname);
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

  const handleBackClick = () => {
    navigate('/chat'); // Navigate to the previous page
  };

  return (
    <Container className="mypage-container">
      <img src={branchImage} alt="Logo" className="prlogo2-1-icon" onClick={handleBackClick}/>
      {!isPasswordVerified ? (
        <div className="my-center-box">
          <Form onSubmit={handleVerifyPassword}>
            <Form.Group className="MainInputGroup">
              <Form.Label className="label">비밀번호를 입력하세요.</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="My-inputField"
              />
              <div className={`MainUnderline ${isPasswordFocused ? 'focused' : ''}`}></div>
            </Form.Group>
            <Button type="submit" variant="secondary" className="MypageButton">
              <FontAwesomeIcon icon={faArrowRight} /> 확인
            </Button>
          </Form>
        </div>
      ) : (
        <div className="my-center-box">
          <Form>
            <Form.Group className="MainInputGroup">
              <Form.Label className="label">사용자명</Form.Label>
              <Form.Control plaintext readOnly value={name} className="My-inputField" />
              <div className="MainUnderline"></div>
              <Button onClick={handleEditname} variant="link" className="edit-button">
                <FontAwesomeIcon icon={faPen} />
              </Button>
            </Form.Group>
            {isEditingname && (
              <div className="edit-section">
                <Form.Group className="MainInputGroup">
                  <Form.Label className="label">새 사용자명</Form.Label>
                  <Form.Control
                    type="text"
                    value={newname}
                    onChange={handleNewnameChange}
                    onFocus={() => setIsNewnameFocused(true)}
                    onBlur={() => setIsNewnameFocused(false)}
                    className="My-inputField"
                  />
                  <div className={`MainUnderline ${isNewnameFocused ? 'focused' : ''}`}></div>
                </Form.Group>
                <Button onClick={handleSaveNewname} variant="primary" className="my-save-button">
                  저장
                </Button>
                <Button onClick={handleCancelEditname} variant="secondary" className="my-cancel-button">
                  닫기
                </Button>
              </div>
            )}
            <Form.Group className="MainInputGroup">
              <Form.Label className="label">비밀번호</Form.Label>
              <Form.Control plaintext readOnly value="********" className="My-inputField" />
              <div className="MainUnderline"></div>
              <Button onClick={handleEditPassword} variant="link" className="edit-button">
                <FontAwesomeIcon icon={faPen} />
              </Button>
            </Form.Group>
            {isEditingPassword && (
              <div className="edit-section">
                <Form.Group className="MainInputGroup">
                  <Form.Label className="label">새 비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    onFocus={() => setIsNewPasswordFocused(true)}
                    onBlur={() => setIsNewPasswordFocused(false)}
                    className="My-inputField"
                  />
                  <div className={`MainUnderline ${isNewPasswordFocused ? 'focused' : ''}`}></div>
                </Form.Group>
                <Button onClick={handleSaveNewPassword} variant="primary" className="my-save-button">
                  저장
                </Button>
                <Button onClick={handleCancelEditPassword} variant="secondary" className="my-cancel-button">
                  닫기
                </Button>
              </div>
            )}
          </Form>
        </div>
      )}
      <Button 
        className="my-back-button"
        onClick={handleBackClick}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </Button>
    </Container>
  );
};

export default MyPage;

// src/components/LoginModal.js
import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/LoginModal.css'

const LoginModal = ({ show, handleClose, handleLogin }) => {
const navigate = useNavigate();
    handleLogin = () => {
        handleClose();
        navigate('/login');
    };

    useEffect(() => {
        if (show) {
          document.body.classList.add('modal-open');
        } else {
          document.body.classList.remove('modal-open');
        }
    
        return () => {
          document.body.classList.remove('modal-open');
        };
      }, [show]);
    
  return (
    <Modal className='loginModal' show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>로그인이 필요합니다.</Modal.Title>
      </Modal.Header>
      <Modal.Body>채팅을 입력하려면 로그인하세요.</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleLogin}>
          로그인
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};



export default LoginModal;

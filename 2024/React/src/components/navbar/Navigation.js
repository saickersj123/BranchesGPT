import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { logout } from '../../api/axiosInstance'; // 로그아웃 함수 가져오기
import '../../css/Navigation.css';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const height = navbar.offsetHeight;
      setNavbarHeight(height);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();  // 로그아웃 요청 보내기
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      // 로그아웃 요청이 성공하든 실패하든 상관없이 브라우저의 로그인 상태를 갱신합니다.
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand href="/">Branch-GPT</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {!isLoggedIn ? (
              <Nav.Link eventKey={2} href="#memes">
                <Nav.Link href="/login">로그인</Nav.Link>
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/mypage">
                  마이페이지
                </Nav.Link>
                <Nav.Link eventKey={3} onClick={handleLogout}>
                  로그아웃
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <div style={{ paddingTop: navbarHeight }} /> {/* 네비게이션 바 높이만큼의 여백을 만듭니다. */}
    </Navbar>
  );
};

export default Navigation;

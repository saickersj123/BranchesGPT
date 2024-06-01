import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import { logout } from '../../api/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FiMoreVertical } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';
import '../../css/Navigation.css';

const Navigation = ({ isLoggedIn, setIsLoggedIn, toggleSidebar, closeSidebar }) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const height = navbar.offsetHeight;
      setNavbarHeight(height);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');
      if (isMobile) {
        closeSidebar();
      }
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary fixed-top justify-content-between">
      <Container className="d-flex justify-content-between align-items-center">
        {isMobile ? (
          <>
            {isLoggedIn && (
              <button className="menu-button" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}
            <Navbar.Brand href="/" className="mx-auto">Branch-GPT</Navbar.Brand>
            {isLoggedIn && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-basic" className="custom-dropdown-toggle">
                  <FiMoreVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/mypage" onClick={closeSidebar}>마이페이지</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </>
        ) : (
          <>
            <Navbar.Brand href="/">Branch-GPT</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav>
                {!isLoggedIn ? (
                  <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/mypage">마이페이지</Nav.Link>
                    <Nav.Link onClick={handleLogout}>
                      {isLoading ? '로그아웃 중...' : '로그아웃'}
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
      <div style={{ paddingTop: navbarHeight }} /> {/* 네비게이션 바 높이만큼의 여백을 만듭니다. */}
    </Navbar>
  );
};

export default Navigation;

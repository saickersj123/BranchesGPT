import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Branch-GPT</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          
          </Nav>
          <Nav>
            {!isLoggedIn ? (
              <Nav.Link eventKey={2} href="#memes">
                <Nav.Link href="/login">로그인</Nav.Link>
              </Nav.Link>
            ) : (
              <>
              <Nav.Link as={Link} to="/mypage">마이페이지</Nav.Link>
              <Nav.Link eventKey={3} onClick={handleLogout}>
                로그아웃
              </Nav.Link>
            </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

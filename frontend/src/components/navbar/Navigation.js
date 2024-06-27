import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, deleteAllChats } from '../../api/axiosInstance'; // deleteAllChats 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog, faSave, faTimes, faRedo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FiMoreVertical } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';
import '../../css/Navigation.css';

const Navigation = ({
  isLoggedIn,
  setIsLoggedIn,
  toggleSidebar,
  closeSidebar,
  toggleEditMode,
  isEditMode,
  handleSaveClick,
  handleCancelClick,
  handleResetLayout,
  loadMessages, // loadMessages 함수 추가
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 상태를 추가
  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isMyPage = location.pathname === '/mypage';

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
      setIsLoggedIn(false);
      sessionStorage.removeItem('authToken');
      navigate('/login'); // 로그아웃 후 로그인 페이지로 리디렉트
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      if (isMobile) {
        closeSidebar();
      }
    }
  };

  const handleDeleteAllChats = async () => {
    setIsDeleting(true);
    try {
      await deleteAllChats();
      alert('대화기록이 성공적으로 삭제되었습니다.');
      loadMessages(); // 대화기록 삭제 후 메시지 다시 불러오기
    } catch (error) {
      console.error('대화기록 삭제 실패:', error);
      alert('대화기록 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
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
            {isLoggedIn && !isMyPage && (
              <button className="menu-button" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}
            <Navbar.Brand href="/" className="mx-auto">Branch-GPT</Navbar.Brand>
            {isLoggedIn && !isMyPage && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-basic" className="custom-dropdown-toggle">
                  <FiMoreVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {isHomePage && <Dropdown.Item onClick={toggleEditMode}>위치조정</Dropdown.Item>}
                  <Dropdown.Item as={Link} to="/mypage" onClick={closeSidebar}>마이페이지</Dropdown.Item>
                  <Dropdown.Item onClick={handleDeleteAllChats}>
                    {isDeleting ? '삭제 중...' : '대화기록 삭제'}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>
                    {isLoading ? '로그아웃 중...' : '로그아웃'}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {isLoggedIn && isMyPage && (
              <Nav.Link onClick={handleLogout} className="mx-auto">
                {isLoading ? '로그아웃 중...' : '로그아웃'}
              </Nav.Link>
            )}
          </>
        ) : (
          <>
            <Navbar.Brand href="/">Branch-GPT</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav>
                {isLoggedIn && (
                  <>
                    {isEditMode ? (
                      <>
                        <Nav.Link onClick={handleSaveClick}>
                          <FontAwesomeIcon icon={faSave} /> 저장
                        </Nav.Link>
                        <Nav.Link onClick={handleCancelClick}>
                          <FontAwesomeIcon icon={faTimes} /> 취소
                        </Nav.Link>
                        <Nav.Link onClick={handleResetLayout}>
                          <FontAwesomeIcon icon={faRedo} /> 초기화
                        </Nav.Link>
                      </>
                    ) : (
                      <>
                        {!isMyPage && (
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="success" id="dropdown-settings" className="custom-dropdown-toggle">
                              <FontAwesomeIcon icon={faCog} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {isHomePage && <Dropdown.Item onClick={toggleEditMode}>위치조정</Dropdown.Item>}
                              <Dropdown.Item as={Link} to="/mypage">마이페이지</Dropdown.Item>
                              <Dropdown.Item onClick={handleDeleteAllChats}>
                                {isDeleting ? '삭제 중...' : '대화기록 삭제'}
                              </Dropdown.Item>
                              <Dropdown.Item onClick={handleLogout}>
                                {isLoading ? '로그아웃 중...' : '로그아웃'}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {isMyPage && (
                          <Nav.Link onClick={handleLogout}>
                            {isLoading ? '로그아웃 중...' : '로그아웃'}
                          </Nav.Link>
                        )}
                      </>
                    )}
                  </>
                )}
                {!isLoggedIn && (
                  <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
      <div style={{ paddingTop: navbarHeight }} />
    </Navbar>
  );
};

export default Navigation;

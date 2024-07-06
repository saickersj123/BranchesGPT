import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSave, faTimes, faRedo, faPlus, faUser, faTrash, faSignOutAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FiMoreVertical } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';
import { deleteAllChats, logout } from '../../api/axiosInstance';
import '../../css/Navigation.css';

const Navigation = ({
  isLoggedIn,
  setIsLoggedIn,
  toggleEditMode,
  isEditMode,
  handleSaveClick,
  handleCancelClick,
  handleResetLayout,
  loadMessages,
  startNewConversationWithMessage, // Home 컴포넌트의 함수를 호출할 수 있도록 콜백 추가
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });
  const navigate = useNavigate();

  const isHomePage = window.location.pathname === '/';
  const isChatPage = window.location.pathname.startsWith('/chat');
  const isMyPage = window.location.pathname === '/mypage';

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
      const logoutSuccess = await logout();
      if (logoutSuccess) { 
        setIsLoggedIn(false);
        navigate('/'); // 로그아웃 성공 시 홈으로 이동
      } else { 
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) { 
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false); 
    }
  };

  const handleDeleteAllChats = async () => {
    setIsDeleting(true);
    try {
      await deleteAllChats();
      alert('대화기록이 성공적으로 삭제되었습니다.'); 
      startNewConversationWithMessage(); // 새로운 채팅 시작
      window.location.reload(); // 페이지 새로고침
    } catch (error) { 
      alert('대화기록 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStartNewChat = () => { 
    startNewConversationWithMessage(''); // 빈 메시지로 새로운 대화를 시작
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary fixed-top justify-content-between">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/" className="mx-auto">Branch-GPT</Navbar.Brand>
        {isLoggedIn && !isMyPage && isMobile && (
          <Dropdown align="end">
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="custom-dropdown-toggle">
              <FiMoreVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {(isHomePage || isChatPage) && (
                <Dropdown.Item onClick={toggleEditMode}>
                  <FontAwesomeIcon icon={faEdit} /> 위치조정
                </Dropdown.Item>
              )}
              <Dropdown.Item as={Link} to="/mypage">
                <FontAwesomeIcon icon={faUser} /> 마이페이지
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDeleteAllChats}>
                {isDeleting ? <FontAwesomeIcon icon={faTrash} spin /> : <FontAwesomeIcon icon={faTrash} />}모든 채팅기록 삭제
              </Dropdown.Item>
              <Dropdown.Item onClick={handleStartNewChat}>
                <FontAwesomeIcon icon={faPlus} /> 새로운 채팅
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                {isLoading ? <FontAwesomeIcon icon={faSignOutAlt} spin /> : <FontAwesomeIcon icon={faSignOutAlt} />} 로그아웃
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
        {isLoggedIn && isMyPage && isMobile && (
          <Nav.Link onClick={handleLogout} className="mx-auto">
            {isLoading ? '로그아웃 중...' : '로그아웃'}
          </Nav.Link>
        )}
        {!isMobile && (
          <>
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
                              {(isHomePage || isChatPage) && (
                                <Dropdown.Item onClick={toggleEditMode}>
                                  <FontAwesomeIcon icon={faEdit} /> 위치조정
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item as={Link} to="/mypage">
                                <FontAwesomeIcon icon={faUser} /> 마이페이지
                              </Dropdown.Item>
                              <Dropdown.Item onClick={handleDeleteAllChats}>
                                {isDeleting ? <FontAwesomeIcon icon={faTrash} spin /> : <FontAwesomeIcon icon={faTrash} />} 모든 채팅기록 삭제
                              </Dropdown.Item>
                              <Dropdown.Item onClick={handleStartNewChat}>
                                <FontAwesomeIcon icon={faPlus} /> 새로운 채팅
                              </Dropdown.Item>
                              <Dropdown.Item onClick={handleLogout}>
                                {isLoading ? <FontAwesomeIcon icon={faSignOutAlt} spin /> : <FontAwesomeIcon icon={faSignOutAlt} />} 로그아웃
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {isMyPage && (
                          <Nav.Link onClick={handleLogout}>
                            {isLoading ? <FontAwesomeIcon icon={faSignOutAlt} spin /> : <FontAwesomeIcon icon={faSignOutAlt} />} 로그아웃
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

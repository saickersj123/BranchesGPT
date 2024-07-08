import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSave, faTimes, faRedo, faPlus, faUser, faTrash, faSignOutAlt, faEdit, faClock, faPalette, faBook } from '@fortawesome/free-solid-svg-icons';
import { FiMoreVertical } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';
import { deleteAllChats, logout } from '../../api/axiosInstance';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import '../../css/Navigation.css';
import ColorPickerPanel from '../ColorPickerPanel';

const Navigation = ({
  isLoggedIn,
  setIsLoggedIn,
  toggleEditMode,
  isEditMode,
  handleSaveClick,
  handleCancelClick,
  handleResetLayout,
  loadMessages,
  startNewConversationWithMessage,
  showTime,
  setShowTime,
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [navbarTextColor, setNavbarTextColor] = useState('#000000');
  const [navbarBold, setNavbarBold] = useState(false);
  const [myChatBubbleColor, setMyChatBubbleColor] = useState('#DCF8C6');
  const [myChatTextColor, setMyChatTextColor] = useState('#000000');
  const [otherChatBubbleColor, setOtherChatBubbleColor] = useState('#F0F0F0');
  const [otherChatTextColor, setOtherChatTextColor] = useState('#000000');
  const [chatBubbleBold, setChatBubbleBold] = useState(false);
  const [chatBubbleShadow, setChatBubbleShadow] = useState(false);
  const [chatContainerBgColor, setChatContainerBgColor] = useState('#FFFFFF');
  const [timeBold, setTimeBold] = useState(false);
  const [isColorPickerPanelOpen, setIsColorPickerPanelOpen] = useState(false);
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

  useEffect(() => {
    document.documentElement.style.setProperty('--navbar-text-color', navbarTextColor);
    document.documentElement.style.setProperty('--button-color', navbarTextColor);
    document.documentElement.style.setProperty('--my-chat-bubble-color', myChatBubbleColor);
    document.documentElement.style.setProperty('--my-chat-text-color', myChatTextColor);
    document.documentElement.style.setProperty('--other-chat-bubble-color', otherChatBubbleColor);
    document.documentElement.style.setProperty('--other-chat-text-color', otherChatTextColor);
    document.documentElement.style.setProperty('--navbar-bold', navbarBold ? 'bold' : 'normal');
    document.documentElement.style.setProperty('--chat-bubble-bold', chatBubbleBold ? 'bold' : 'normal');
    document.documentElement.style.setProperty('--chat-bubble-shadow', chatBubbleShadow ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none');
    document.documentElement.style.setProperty('--chat-container-bg-color', chatContainerBgColor);
    document.documentElement.style.setProperty('--time-bold', timeBold ? 'bold' : 'normal');
  }, [navbarTextColor, navbarBold, myChatBubbleColor, myChatTextColor, otherChatBubbleColor, otherChatTextColor, chatBubbleBold, chatBubbleShadow, chatContainerBgColor, timeBold]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const logoutSuccess = await logout();
      if (logoutSuccess) {
        setIsLoggedIn(false);
        navigate('/');
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
      startNewConversationWithMessage();
      window.location.reload();
    } catch (error) {
      alert('대화기록 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStartNewChat = () => {
    startNewConversationWithMessage('');
  };

  const handleCustomButtonClick = () => {
    // 여기서 아무 작업도 하지 않음
  };

  const handleCloseColorPickerPanel = () => {
    setIsColorPickerPanelOpen(false);
  };

  const handleToggleEditMode = () => {
    toggleEditMode();
    handleCloseColorPickerPanel();
  };

  const handleSelectOption = (option) => {
    if (option === 'edit') {
      handleToggleEditMode();
    } else if (option === 'color') {
      setIsColorPickerPanelOpen(true);
    } else if (option === 'pretrain') {
      alert('사전학습 기능은 나중에 추가될 예정입니다.');
    }
  };

  const handleToggleShowTime = () => {
    setShowTime(prevShowTime => !prevShowTime);
  };

  return (
    <div className={`main-container ${isColorPickerPanelOpen ? 'shrink' : ''}`}>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary fixed-top justify-content-between">
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Brand href="/" className="mx-auto" style={{ color: navbarTextColor, fontWeight: navbarBold ? 'bold' : 'normal' }}>Branch-GPT</Navbar.Brand>
          {isLoggedIn && !isMyPage && isMobile && (
            <Dropdown align="end">
              <Dropdown.Toggle variant="success" id="dropdown-basic" className="custom-dropdown-toggle">
                <FiMoreVertical />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                {(isHomePage || isChatPage) && (
                  <Dropdown.Item onClick={handleToggleEditMode} className="dropdown-item">
                    <FontAwesomeIcon icon={faEdit} className="icon" />
                    <span className="icon-text">위치조정</span>
                  </Dropdown.Item>
                )}
                <Dropdown.Item as={Link} to="/mypage" className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} className="icon" />
                  <span className="icon-text">마이페이지</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteAllChats} className="dropdown-item">
                  {isDeleting ? <FontAwesomeIcon icon={faTrash} spin className="icon" /> : <FontAwesomeIcon icon={faTrash} className="icon" />}
                  <span className="icon-text">모든 채팅기록 삭제</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleStartNewChat} className="dropdown-item">
                  <FontAwesomeIcon icon={faPlus} className="icon" />
                  <span className="icon-text">새로운 채팅</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="dropdown-item">
                  {isLoading ? <FontAwesomeIcon icon={faSignOutAlt} spin className="icon" /> : <FontAwesomeIcon icon={faSignOutAlt} className="icon" />}
                  <span className="icon-text">로그아웃</span>
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
                  {isLoggedIn && !isEditMode && (
                    <>
                      <Nav.Link onClick={handleStartNewChat}>
                        <FontAwesomeIcon icon={faPlus} className="icon" />
                        <span className="icon-text"> </span>
                      </Nav.Link>
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="success" id="dropdown-custom" className="custom-dropdown-toggle">
                          <AdjustmentsHorizontalIcon className="icon flex-shrink-0" />
                          <span className="icon-text"></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                          <Dropdown.Item onClick={() => handleSelectOption('edit')} className="dropdown-item">
                            <FontAwesomeIcon icon={faEdit} className="icon" />
                            <span className="icon-text">위치조정 모드</span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleSelectOption('color')} className="dropdown-item">
                            <FontAwesomeIcon icon={faPalette} className="icon" />
                            <span className="icon-text">색상 변경</span>
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleSelectOption('pretrain')} className="dropdown-item">
                            <FontAwesomeIcon icon={faBook} className="icon" />
                            <span className="icon-text">사전학습 (추후 추가)</span>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )}
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
                                <FontAwesomeIcon icon={faCog} className="icon" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="dropdown-menu">
                                {(isHomePage || isChatPage)}
                                <Dropdown.Item as={Link} to="/mypage" className="dropdown-item">
                                  <FontAwesomeIcon icon={faUser} className="icon" />
                                  <span className="icon-text">마이페이지</span>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleDeleteAllChats} className="dropdown-item">
                                  {isDeleting ? <FontAwesomeIcon icon={faTrash} spin className="icon" /> : <FontAwesomeIcon icon={faTrash} className="icon" />}
                                  <span className="icon-text">모든 채팅기록 삭제</span>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout} className="dropdown-item">
                                  {isLoading ? <FontAwesomeIcon icon={faSignOutAlt} spin className="icon" /> : <FontAwesomeIcon icon={faSignOutAlt} className="icon" />}
                                  <span className="icon-text">로그아웃</span>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                          {isMyPage && (
                            <Nav.Link onClick={handleLogout}>
                              {isLoading ? <FontAwesomeIcon icon={faSignOutAlt} spin className="icon" /> : <FontAwesomeIcon icon={faSignOutAlt} className="icon" />}
                              <span className="icon-text"> </span>
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
      {isColorPickerPanelOpen && (
        <ColorPickerPanel
          navbarTextColor={navbarTextColor}
          setNavbarTextColor={setNavbarTextColor}
          navbarBold={navbarBold}
          setNavbarBold={setNavbarBold}
          myChatBubbleColor={myChatBubbleColor}
          setMyChatBubbleColor={setMyChatBubbleColor}
          myChatTextColor={myChatTextColor}
          setMyChatTextColor={setMyChatTextColor}
          otherChatBubbleColor={otherChatBubbleColor}
          setOtherChatBubbleColor={setOtherChatBubbleColor}
          otherChatTextColor={otherChatTextColor}
          setOtherChatTextColor={setOtherChatTextColor}
          chatBubbleBold={chatBubbleBold}
          setChatBubbleBold={setChatBubbleBold}
          chatBubbleShadow={chatBubbleShadow}
          setChatBubbleShadow={setChatBubbleShadow}
          chatContainerBgColor={chatContainerBgColor}
          setChatContainerBgColor={setChatContainerBgColor}
          showTime={showTime}
          setShowTime={setShowTime}
          timeBold={timeBold}
          setTimeBold={setTimeBold}
          closePanel={handleCloseColorPickerPanel}
        />
      )}
    </div>
  );
};

export default Navigation;

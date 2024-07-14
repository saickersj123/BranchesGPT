import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSave, faTimes, faRedo, faPlus, faUser, faSignOutAlt, faEdit, faPalette, faBook } from '@fortawesome/free-solid-svg-icons';
import { FiMoreVertical } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';
import { logout } from '../../api/axiosInstance';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
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
  startNewConversationWithMessage,
  showTime,
  setShowTime,
  darkMode,
  handleOpenPanel,
  handleClosePanel,
  toggleDarkMode // 추가된 다크 모드 토글 함수 전달
}) => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

  const getSystemMode = () => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? 'dark' : 'light';
  };

  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
      return savedMode;
    } else {
      localStorage.setItem('mode', 'system');
      return 'system';
    }
  });

  useEffect(() => {
    const currentMode = mode === 'system' ? getSystemMode() : mode;
    if (currentMode === 'dark') {
      document.documentElement.classList.add('dark');
      setNavbarTextColor('#ffffff'); // 다크 모드 텍스트 색상 설정
    } else {
      document.documentElement.classList.remove('dark');
      setNavbarTextColor('#000000'); // 라이트 모드 텍스트 색상 설정
    }

    document.documentElement.style.setProperty('--navbar-bg-color', currentMode === 'dark' ? 'var(--dark-navbar-bg-color)' : '#f1f3f5');
    document.documentElement.style.setProperty('--navbar-text-color', currentMode === 'dark' ? 'var(--dark-navbar-text-color)' : '#000000');
  }, [mode]);

  const handleToggleDarkMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
    toggleDarkMode(newMode); // app.js의 모드도 함께 변경
  };

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

  const handleStartNewChat = () => {
    startNewConversationWithMessage('');
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
      handleOpenPanel();
      setIsColorPickerPanelOpen(true);
    } else if (option === 'pretrain') {
      navigate('/pretrain');
    }
  };

  const closeColorPickerPanel = () => {
    handleClosePanel();
    setIsColorPickerPanelOpen(false);
  };

  return (
    <div className={`main-container ${isColorPickerPanelOpen ? 'shrink' : ''} ${mode === 'dark' ? 'dark' : ''}`}>
      <Navbar collapseOnSelect expand="lg" className={`fixed-top justify-content-between ${mode === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Brand href="/" className="mx-auto" style={{ color: navbarTextColor, fontWeight: navbarBold ? 'bold' : 'normal' }}>Branch-GPT</Navbar.Brand>
          {isLoggedIn && !isMyPage && isMobile && (
            <Dropdown align="end">
              <Dropdown.Toggle variant="success" id="dropdown-basic" className="custom-dropdown-toggle">
                <FiMoreVertical style={{ color: navbarTextColor }} />
              </Dropdown.Toggle>
              <Dropdown.Menu className={`dropdown-menu ${mode === 'dark' ? 'dark' : ''}`}>
                {(isHomePage || isChatPage) && (
                  <Dropdown.Item onClick={handleToggleEditMode} className="dropdown-item">
                    <FontAwesomeIcon icon={faEdit} className="icon" style={{ color: navbarTextColor }} />
                    <span className="icon-text" style={{ color: navbarTextColor }}>위치조정</span>
                  </Dropdown.Item>
                )}
                <Dropdown.Item as={Link} to="/mypage" className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} className="icon" style={{ color: navbarTextColor }} />
                  <span className="icon-text" style={{ color: navbarTextColor }}>마이페이지</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleStartNewChat} className="dropdown-item">
                  <FontAwesomeIcon icon={faPlus} className="icon" style={{ color: navbarTextColor }} />
                  <span className="icon-text" style={{ color: navbarTextColor }}>새로운 채팅</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="dropdown-item">
                  {isLoading ? <FontAwesomeIcon icon={faSignOutAlt} spin className="icon" /> : <FontAwesomeIcon icon={faSignOutAlt} className="icon" style={{ color: navbarTextColor }} />}
                  <span className="icon-text" style={{ color: navbarTextColor }}>로그아웃</span>
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
                  {isLoggedIn && !isEditMode && !isMyPage && (
                    <>
                      <Nav.Link onClick={handleStartNewChat}>
                        <FontAwesomeIcon icon={faPlus} className="icon" style={{ color: navbarTextColor }} />
                        <span className="icon-text"> </span>
                      </Nav.Link>
                      <Dropdown align="end">
                      <Dropdown.Toggle variant="success" id="dropdown-custom" className="custom-dropdown-toggle">
                        <AdjustmentsHorizontalIcon className="icon flex-shrink-0" style={{ color: navbarTextColor }} />
                        <span className="icon-text"></span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className={`dropdown-menu ${mode === 'dark' ? 'dark' : ''}`}>
                        <Dropdown.Item onClick={() => handleSelectOption('edit')} className="dropdown-item">
                          <FontAwesomeIcon icon={faEdit} className="icon" style={{ color: navbarTextColor }} />
                          <span className="icon-text" style={{ color: navbarTextColor }}>위치조정 모드</span>
                        </Dropdown.Item>
                        <Dropdown drop="end">
                          <Dropdown.Toggle as="span" className="dropdown-item">
                            <FaMoon className="icon" style={{ color: navbarTextColor }} />
                            <span className="icon-text" style={{ color: navbarTextColor }}>다크 모드 설정</span>
                          </Dropdown.Toggle> 
                          <Dropdown.Menu className={`dropdown-menu ${mode === 'dark' ? 'dark' : ''}`}>
                            <Dropdown.Item onClick={() => handleToggleDarkMode('light')} className="dropdown-item">
                              <FaSun className="icon" style={{ color: navbarTextColor }} />
                              <span className="icon-text" style={{ color: navbarTextColor }}>라이트 모드</span>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleToggleDarkMode('dark')} className="dropdown-item">
                              <FaMoon className="icon" style={{ color: navbarTextColor }} />
                              <span className="icon-text" style={{ color: navbarTextColor }}>다크 모드</span>
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleToggleDarkMode('system')} className="dropdown-item">
                              <FaDesktop className="icon" style={{ color: navbarTextColor }} />
                              <span className="icon-text" style={{ color: navbarTextColor }}>시스템 모드</span>
                            </Dropdown.Item>
                          </Dropdown.Menu> 
                        </Dropdown>
                        <Dropdown.Item onClick={() => handleSelectOption('color')} className="dropdown-item">
                          <FontAwesomeIcon icon={faPalette} className="icon" style={{ color: navbarTextColor }} />
                          <span className="icon-text" style={{ color: navbarTextColor }}>색상 변경</span>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSelectOption('pretrain')} className="dropdown-item">
                          <FontAwesomeIcon icon={faBook} className="icon" style={{ color: navbarTextColor }} />
                          <span className="icon-text" style={{ color: navbarTextColor }}>사전학습</span>
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
                                <FontAwesomeIcon icon={faCog} className="icon" style={{ color: navbarTextColor }} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu className={`dropdown-menu ${mode === 'dark' ? 'dark' : ''}`}>
                                {(isHomePage || isChatPage)}
                                <Dropdown.Item as={Link} to="/mypage" className="dropdown-item">
                                  <FontAwesomeIcon icon={faUser} className="icon" style={{ color: navbarTextColor }} />
                                  <span className="icon-text" style={{ color: navbarTextColor }}>마이페이지</span>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout} className="dropdown-item">
                                  {isLoading ? <FontAwesomeIcon icon={faSignOutAlt} spin className="icon" /> : <FontAwesomeIcon icon={faSignOutAlt} className="icon" style={{ color: navbarTextColor }} />}
                                  <span className="icon-text" style={{ color: navbarTextColor }}>로그아웃</span>
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
          closePanel={closeColorPickerPanel}
          darkMode={darkMode} // 다크 모드 상태 전달
          toggleDarkMode={handleToggleDarkMode} // 다크 모드 토글 함수 전달
        />
      )}
    </div>
  );
};

export default Navigation;

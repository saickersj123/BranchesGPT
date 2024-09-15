import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaBars, FaCog } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import GridLayout from 'react-grid-layout';
import { logout } from '../api/axiosInstance';
import { Dropdown } from 'react-bootstrap';
import { fetchMessages, fetchConversations, getChatboxes, saveChatbox, resetChatbox } from '../api/axiosInstance';
import '../css/Home.css';
import LoginModal from '../components/LoginModal';
import ColorPickerPanel from '../components/ColorPickerPanel';
import { faPalette, faRightFromBracket, faSquareMinus, faUser } from '@fortawesome/free-solid-svg-icons';

const MAX_Y_H_SUM = 9;
const DEFAULT_MODEL = "gpt-3.5-turbo";
const INITIAL_LAYOUT = [
  { i: 'chatContainer', x: 2, y: 0.5, w: 8, h: 8, minH: 4, minW: 3, maxW: 12, maxH: 9 }
];

const Home = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  messages,
  setMessages,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [maxYHSum] = useState(MAX_Y_H_SUM);
  const [username, setUsername] = useState('');
  const [currentLayout, setCurrentLayout] = useState(INITIAL_LAYOUT);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);  // Add state for selected model
  const originalLayoutRef = useRef(INITIAL_LAYOUT);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { conversationId: urlConversationId } = useParams();
  const [isLayoutEditing, setIsLayoutEditing] = useState(false);
  const [isColorPickerPanelOpen, setIsColorPickerPanelOpen] = useState(false);
  const [myChatBubbleColor, setMyChatBubbleColor] = useState('#DCF8C6');
  const [myChatTextColor, setMyChatTextColor] = useState('#000000');
  const [otherChatBubbleColor, setOtherChatBubbleColor] = useState('#F0F0F0');
  const [otherChatTextColor, setOtherChatTextColor] = useState('#000000');
  const [chatBubbleBold, setChatBubbleBold] = useState(false);
  const [chatBubbleShadow, setChatBubbleShadow] = useState(false);
  const [chatContainerBgColor, setChatContainerBgColor] = useState('#FFFFFF');
  const [timeBold, setTimeBold] = useState(false);
  const [showTime, setShowTime] = useState(true);
  const [previousSidebarState, setPreviousSidebarState] = useState(false); // New state to track previous sidebar state

  useEffect(() => {
    const loadStyleSettings = () => {
      const settings = {
        myChatBubbleColor: localStorage.getItem('myChatBubbleColor'),
        myChatTextColor: localStorage.getItem('myChatTextColor'),
        otherChatBubbleColor: localStorage.getItem('otherChatBubbleColor'),
        otherChatTextColor: localStorage.getItem('otherChatTextColor'),
        chatContainerBgColor: localStorage.getItem('chatContainerBgColor'),
        chatBubbleBold: JSON.parse(localStorage.getItem('chatBubbleBold')),
        chatBubbleShadow: JSON.parse(localStorage.getItem('chatBubbleShadow')),
        timeBold: JSON.parse(localStorage.getItem('timeBold')),
      };

      if (settings.myChatBubbleColor) setMyChatBubbleColor(settings.myChatBubbleColor);
      if (settings.myChatTextColor) setMyChatTextColor(settings.myChatTextColor);
      if (settings.otherChatBubbleColor) setOtherChatBubbleColor(settings.otherChatBubbleColor);
      if (settings.otherChatTextColor) setOtherChatTextColor(settings.otherChatTextColor);
      if (settings.chatContainerBgColor) setChatContainerBgColor(settings.chatContainerBgColor);
      if (settings.chatBubbleBold !== null) setChatBubbleBold(settings.chatBubbleBold);
      if (settings.chatBubbleShadow !== null) setChatBubbleShadow(settings.chatBubbleShadow);
      if (settings.timeBold !== null) setTimeBold(settings.timeBold);
    };

    if (user) {
      setUsername(user.name);
    }

    loadStyleSettings();
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const loadConversationMessages = async () => {
      if (urlConversationId) {
        try {
          let fetchedMessages = await fetchMessages(urlConversationId);
          setMessages(fetchedMessages);
          setSelectedConversationId(urlConversationId);
          setIsNewChat(false);
        } catch (error) {
          console.error('Error loading conversation messages:', error);
        }
      }
    };

    loadConversationMessages();
  }, [urlConversationId, setMessages]);

  useEffect(() => {
    document.documentElement.style.setProperty('--my-chat-bubble-color', myChatBubbleColor);
    document.documentElement.style.setProperty('--my-chat-text-color', myChatTextColor);
    document.documentElement.style.setProperty('--other-chat-bubble-color', otherChatBubbleColor);
    document.documentElement.style.setProperty('--other-chat-text-color', otherChatTextColor);
    document.documentElement.style.setProperty('--chat-bubble-bold', chatBubbleBold ? 'bold' : 'normal');
    document.documentElement.style.setProperty('--chat-bubble-shadow', chatBubbleShadow ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none');
    document.documentElement.style.setProperty('--chat-container-bg-color', chatContainerBgColor);
    document.documentElement.style.setProperty('--time-bold', timeBold ? 'bold' : 'normal');
  }, [ myChatBubbleColor, myChatTextColor, otherChatBubbleColor, otherChatTextColor, chatBubbleBold, chatBubbleShadow, chatContainerBgColor, timeBold]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchConversations();
        setConversations(fetchedConversations);

        if (fetchedConversations.length === 0) {
          setIsNewChat(true);
        } else if (fetchedConversations.length > 0 && !urlConversationId) {
          setSelectedConversationId(fetchedConversations[fetchedConversations.length-1]._id);
          navigate(`/chat/${fetchedConversations[fetchedConversations.length-1]._id}`);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };

    if (isLoggedIn) {
      loadConversations();
    }
  }, [isLoggedIn, navigate, urlConversationId]);

  useEffect(() => {
    const loadChatboxLayout = async () => {
      try {
        const fetchedChatbox = await getChatboxes();

        if (fetchedChatbox) {
          const validatedChatbox = [{
            i: 'chatContainer',
            x: Number(fetchedChatbox.cbox_x),
            y: Number(fetchedChatbox.cbox_y),
            w: Number(fetchedChatbox.cbox_w),
            h: Number(fetchedChatbox.cbox_h),
            minH: 4,
            minW: 3,
            maxW: 12,
            maxH: 9
          }];
          setCurrentLayout(validatedChatbox);
          originalLayoutRef.current = validatedChatbox;
        } else {
          setCurrentLayout(INITIAL_LAYOUT);
          originalLayoutRef.current = INITIAL_LAYOUT;
        }
      } catch (error) {
        console.error('Failed to fetch chatbox layout:', error);
        setCurrentLayout(INITIAL_LAYOUT);
        originalLayoutRef.current = INITIAL_LAYOUT;
      }
    };

    if (isLoggedIn) {
      loadChatboxLayout();
    }
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  useEffect(() => {
    if(isLoggedIn){
      const initialSidebarState = loadSidebarState();
      setIsSidebarOpen(initialSidebarState);
    }
  }, [isLoggedIn]);

  const saveSidebarState = (isOpen) => {
    localStorage.setItem('sidebarState', isOpen ? 'open' : 'closed');
  };

  const loadSidebarState = () => {
    const state = localStorage.getItem('sidebarState');
    return state === 'open';
  };

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    saveSidebarState(newState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    saveSidebarState(false);
  };

  const handleProfileClick = async () => {
    navigate("/mypage");
  };

  const handleLogoutClick = async () => {
    try {
      const logoutSuccess = await logout();
      if (logoutSuccess) {
        setIsLoggedIn(false);
        setIsSidebarOpen(false);
        navigate('/chat');
      } else {
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChatInputAttempt = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  };

  const handleNewMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    updateConversations();
  }, [setMessages]);

  const handleUpdateMessage = useCallback((aiMessage) => {
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    updateConversations();
  }, [setMessages]);

  const handleConversationSelect = async (conversationId) => {
    try {
      const fetchedMessages = await fetchMessages(conversationId);
      setMessages(fetchedMessages);
      setSelectedConversationId(conversationId);
      setIsNewChat(false);
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    }
  };

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);  // Set the selected model
  };

  const updateConversations = async () => {
    try {
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations);
    } catch (error) {
      console.error('Failed to update conversations:', error);
    }
  };

  const validateLayout = (layout) => {
    const occupiedPositions = new Set();
    return layout.map(item => {
      let { x, y, w, h } = item;
      if (y < 0) y = 0;
      if (y + h > maxYHSum) y = 0;
      while (isPositionOccupied(x, y, w, h, occupiedPositions)) {
        x = (x + 1) % 12;
        if (x === 0) {
          y = (y + 1) % maxYHSum;
        }
        if (y + h > maxYHSum) {
          y = 0;
        }
      }
      markPosition(x, y, w, h, occupiedPositions);
      return { ...item, x, y, w, h };
    });
  };

  const isPositionOccupied = (x, y, w, h, occupiedPositions) => {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (occupiedPositions.has(`${x + i},${y + j}`)) {
          return true;
        }
      }
    }
    return false;
  };

  const markPosition = (x, y, w, h, occupiedPositions) => {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        occupiedPositions.add(`${x + i},${y + j}`);
      }
    }
  };

  const handleLayoutChange = (newLayout) => {
    const validatedLayout = validateLayout(newLayout);
    setCurrentLayout(validatedLayout);
  };

  const handleResizeStop = (layout) => {
    const validatedLayout = validateLayout(layout);
    setCurrentLayout(validatedLayout);
  };

  const handleDragStop = (layout) => {
    const validatedLayout = validateLayout(layout);
    setCurrentLayout(validatedLayout);
  };

  const handleResetLayout = async () => {
    try {
      await resetChatbox();
      setCurrentLayout(INITIAL_LAYOUT);
      originalLayoutRef.current = INITIAL_LAYOUT;
    } catch (error) {
      console.error('Failed to reset chatbox layout:', error);
    }
  };

  const handleSaveLayout = async () => {
    try {
      const chatbox = {
        cbox_x: currentLayout[0].x,
        cbox_y: currentLayout[0].y,
        cbox_w: currentLayout[0].w,
        cbox_h: currentLayout[0].h,
      };
      await saveChatbox(chatbox);
      originalLayoutRef.current = currentLayout;
      setIsLayoutEditing(false);
      setIsSidebarOpen(previousSidebarState); // Restore sidebar state after saving layout
    } catch (error) {
      console.error('Failed to save chatbox layout:', error);
    }
  };

  const handleCancelLayout = () => {
    setCurrentLayout(originalLayoutRef.current);
    setIsLayoutEditing(false);
    setIsSidebarOpen(previousSidebarState); // Restore sidebar state after canceling layout editing
  };

  const handleSettingsClick = () => {
    setPreviousSidebarState(isSidebarOpen); // Save the current sidebar state
    setIsSidebarOpen(false); // Close the sidebar
    setIsLayoutEditing(true);
  };

  const handleColorClick = () => {
    setPreviousSidebarState(isSidebarOpen); // Save the current sidebar state
    setIsSidebarOpen(false); // Close the sidebar
    setIsColorPickerPanelOpen(true); // Open the color picker panel
  };

  const handleClosePanel = () => {
    setIsColorPickerPanelOpen(false);
    setIsSidebarOpen(previousSidebarState); // Restore the previous sidebar state
  };

  const handleNewConversation = async (newConversationId) => {
    setSelectedConversationId(newConversationId);
    setIsNewChat(false);
    navigate(`/chat/${newConversationId}`);
  };

  const handleConversationDelete = async (resetChat = false) => {
    try {
      const updatedConversations = await fetchConversations();
      setConversations(updatedConversations);
      if (resetChat) {
        setSelectedConversationId(null);
        setIsNewChat(true);
        navigate('/chat');
      }
    } catch (error) {
      console.error('Failed to update conversations list:', error);
    }
  };

  return (
    <main className={`main-section`}>
      <div className={`header-container ${isSidebarOpen ? 'shifted-header' : ''}`}>
        {isLoggedIn && (
          <button className="toggle-sidebar-button" onClick={toggleSidebar}>
            <FaBars size={20} />
          </button>
        )}
         <span className="brand-text" onClick={() => navigate('/chat')}>BranchesGPT</span>
      </div>
      {isLoggedIn ? (
        <>
          <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isLoggedIn={isLoggedIn}
            closeSidebar={closeSidebar}
            conversations={conversations}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            onConversationDelete={handleConversationDelete}
            onModelSelect={handleModelSelect}  // Pass the handleModelSelect function
          />
          {isLayoutEditing ? (
            <div className="settings-container">
              <button className="save-button" onClick={handleSaveLayout}>저장</button>
              <button className="cancel-button" onClick={handleCancelLayout}>취소</button>
              <button className="reset-button" onClick={handleResetLayout}>초기화</button>
            </div>
          ) : (
            <div className="settings-container">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  <FaCog size={20} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleProfileClick}> <FontAwesomeIcon icon={faUser} /> 프로필</Dropdown.Item>
                  <Dropdown.Item onClick={handleSettingsClick}><FontAwesomeIcon icon={faSquareMinus} /> Chatbox 변경</Dropdown.Item>
                  <Dropdown.Item onClick={handleColorClick}><FontAwesomeIcon icon={faPalette} /> 스타일 변경</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogoutClick}><FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          {isColorPickerPanelOpen && (
            <ColorPickerPanel
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
              closePanel={handleClosePanel} // Use handleClosePanel to close the color picker
            />
          )}
        </>
      ) : (
        <div className="login-container">
          <button className="login-button" onClick={handleLoginClick}>로그인</button>
        </div>
      )}
      <div className={`main-content ${isSidebarOpen ? 'shifted-right' : ''}`}>
        <div className="grid-container">
          <GridLayout
            className="layout"
            layout={currentLayout}
            cols={12}
            rowHeight={(viewportHeight - 56) / 9}
            width={viewportWidth}
            isResizable={isLayoutEditing}
            isDraggable={isLayoutEditing}
            onLayoutChange={handleLayoutChange}
            onResizeStop={handleResizeStop}
            onDragStop={handleDragStop}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            compactType={null}
            preventCollision={true}
            verticalCompact={false}
          >
            <div
              key="chatContainer"
              className={`grid-item chat-container ${isLayoutEditing ? 'edit-mode' : ''} ${!isLayoutEditing ? 'no-border' : ''}`}
              data-grid={{ ...currentLayout.find(item => item.i === 'chatContainer'), resizeHandles: isLayoutEditing ? ['s', 'e', 'w', 'n'] : [] }}
            >
              <div className="chat-list-container" style={{ flexGrow: 1 }}>
                {isNewChat ? (
                  <div className="alert alert-info text-center">
                    새로운 대화를 시작해 보세요!
                  </div>
                ) : (
                  <ChatList
                    messages={messages}
                    username={username}
                    conversationId={selectedConversationId}
                    showTime={true}
                  />
                )}
              </div>
              <div className="chat-box-container">
                <ChatBox
                  onNewMessage={handleNewMessage}
                  onUpdateMessage={handleUpdateMessage}
                  isLayoutEditing={setIsLayoutEditing}
                  conversationId={selectedConversationId}
                  isNewChat={isNewChat}
                  onChatInputAttempt={handleChatInputAttempt}
                  isLoggedIn={isLoggedIn}
                  selectedModel={selectedModel}  // Pass the selected model to ChatBox
                  onNewConversation={handleNewConversation}  // Add this prop to handle new conversations
                />
              </div>
            </div>
          </GridLayout>
        </div>
      </div>
      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        handleLogin={handleLoginClick}
      />
    </main>
  );
};

export default Home;

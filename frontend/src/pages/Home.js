import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaBars, FaCog } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import GridLayout from 'react-grid-layout';
import {  logout, sendMessagetoModel,
          } from '../api/axiosInstance';
import { Dropdown } from 'react-bootstrap';
import {  fetchMessages,
          startNewConversation, 
          startNewModelConversation, 
          fetchConversations, 
          sendMessage, 
          getChatboxes, 
          saveChatbox, 
          resetChatbox, 
           } from '../api/axiosInstance';
import '../css/Home.css';
import LoginModal from '../components/LoginModal';

const MAX_Y_H_SUM = 9;

const INITIAL_LAYOUT = [
  { i: 'chatContainer', x: 2, y: 0.5, w: 8, h: 8, minH: 4, minW: 3, maxW: 12, maxH: 9 }
];

const Home = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  messages,
  setMessages,
  showTime
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [maxYHSum] = useState(MAX_Y_H_SUM);
  const [username, setUsername] = useState('');
  const [currentLayout, setCurrentLayout] = useState(INITIAL_LAYOUT);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isNewChat, setIsNewChat] = useState(true);
  const [conversations, setConversations] = useState([]);
  const originalLayoutRef = useRef(INITIAL_LAYOUT);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { conversationId: urlConversationId } = useParams();
  const [isLayoutEditing, setIsLayoutEditing] = useState(false);
  
  useEffect(() => {
    if (user) {
      setUsername(user.name);
    }
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
    if (conversations.length > 0 && !urlConversationId) {
      setSelectedConversationId(conversations[0]._id);
      navigate(`/chat/${conversations[0]._id}`);
    } else if (conversations.length === 0) {
      setSelectedConversationId(null);
      navigate('/');
    }
  }, [conversations, urlConversationId, navigate]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchConversations();
        setConversations(fetchedConversations);
        if (fetchedConversations.length > 0) {
          setSelectedConversationId(fetchedConversations[fetchedConversations.length - 1]._id);
          navigate(`/chat/${fetchedConversations[fetchedConversations.length - 1]._id}`);
        }
      } catch (error) {
        console.error('대화 목록 가져오기 실패:', error);
      }
    };

    if (isLoggedIn) {
      loadConversations();
    }
  }, [isLoggedIn, navigate]);

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
        console.error('Chatbox layout 가져오기 실패:', error);
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

  // Load the sidebar state from localStorage when the component mounts
  useEffect(() => {
    const initialSidebarState = loadSidebarState();
    setIsSidebarOpen(initialSidebarState);
  }, []);

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
      navigate("/mypage")
  };

  const handleLogoutClick = async () => {
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

  const handleConversationSelect = (conversationId) => {
    setSelectedConversationId(conversationId);
    setIsNewChat(false);
    navigate(`/chat/${conversationId}`);
  };

  const startNewConversationWithMessage = async (messageContent) => {
    try {
        const newConversationResponse = await startNewConversation(messageContent);
        let newConversationId = newConversationResponse.conversations[newConversationResponse.conversations.length - 1]._id;
      
        if (!newConversationId) {
        console.warn('No new conversation started.');
        return;
      }

      const response = await sendMessage(newConversationId, messageContent);

      if (response && response.length > 0) {
        const aiMessage = {
          content: response[response.length - 1].content,
          role: 'assistant',
          createdAt: new Date().toISOString()
        };
        handleUpdateMessage(aiMessage);
      }

      setSelectedConversationId(newConversationId);
      navigate(`/chat/${newConversationId}`);
      setIsNewChat(false);
      return newConversationId;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized (401):', error.response.data);
      } else {
        console.error('새로운 대화 시작 실패:', error);
      }
    }
  };

  const startNewModelConversationWithMessage = async (messageContent, modelId) => {
    try {
      if (!modelId) {
        console.error('모델이 선택되지 않았습니다.');
        return;
      }

      const newConversationResponse = await startNewModelConversation(modelId, messageContent);
      const newConversationId = newConversationResponse.conversationId; // 새로운 대화 ID를 응답에서 추출

      if (!newConversationId) {
        console.warn('No new conversation started.');
        return;
      }

      const response = await sendMessagetoModel(modelId, newConversationId, messageContent);

      if (response && response.length > 0) {
        const aiMessage = {
          content: response[response.length - 1].content,
          role: 'assistant',
          createdAt: new Date().toISOString()
        };
        handleUpdateMessage(aiMessage);
      }

      setSelectedConversationId(newConversationId);
      navigate(`/chat/${newConversationId}`);
      setIsNewChat(false);
      return newConversationId;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized (401):', error.response.data);
      } else {
        console.error('새로운 대화 시작 실패:', error);
      }
    }
  };

  const updateConversations = async () => {
    try {
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations);
    } catch (error) {
      console.error('대화 목록 갱신 실패:', error);
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
      console.error('Chatbox layout 초기화 실패:', error);
    }
  };

  const handleSaveLayout = async () => {
    try {
      const chatbox = {
        cbox_x: currentLayout[0].x,
        cbox_y: currentLayout[0].y,
        cbox_w: currentLayout[0].w,
        cbox_h: currentLayout[0].h
      };
      await saveChatbox(chatbox);
      originalLayoutRef.current = currentLayout;
      setIsLayoutEditing(false);
    } catch (error) {
      console.error('Chatbox layout 저장 실패:', error);
    }
  };

  const handleCancelLayout = () => {
    setCurrentLayout(originalLayoutRef.current);
    setIsLayoutEditing(false);
  };

  const handleSettingsClick = () => {
    setIsLayoutEditing(true);
  };


  useEffect(() => {
    if (conversations.length === 0) {
      setIsNewChat(true);
    } else if (conversations.length > 0 && !urlConversationId) {
      setSelectedConversationId(conversations[0]._id);
      navigate(`/chat/${conversations[0]._id}`);
    }
  }, [conversations, urlConversationId, navigate]);

  const handleConversationDelete = async () => {
    try {
      const updatedConversations = await fetchConversations();
      setConversations(updatedConversations);
    } catch (error) {
      console.error('대화 목록 업데이트 실패:', error);
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
        <span className="brand-text">BranchGPT</span>
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
            onNewChat={() => {
              setMessages([]);
              setIsNewChat(true);
            }}
            onConversationDelete={handleConversationDelete}
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
                  <Dropdown.Item onClick={handleProfileClick}>프로필</Dropdown.Item>
                  <Dropdown.Item onClick={handleSettingsClick}>UI 설정</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogoutClick}>로그아웃</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
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
                    새로운 채팅을 시작해 보세요!
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
                  startNewConversationWithMessage={startNewConversationWithMessage}
                  startNewModelConversationWithMessage={startNewModelConversationWithMessage}
                  onChatInputAttempt={handleChatInputAttempt}
                  isLoggedIn={isLoggedIn}
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

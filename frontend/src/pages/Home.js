import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import Navigation from '../components/navbar/Navigation';
import GridLayout from 'react-grid-layout';
import { checkAuthStatus, fetchMessages, startNewConversation, fetchConversations, sendMessage } from '../api/axiosInstance';
import '../css/Home.css';

const MAX_Y_H_SUM = 9;

const INITIAL_LAYOUT = [
  { i: 'chatContainer', x: 2, y: 0.5, w: 8, h: 8, minH: 4, minW: 3, maxW: 12, maxH: 9 }
];

const Home = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  isEditMode,
  loadMessages,
  messages,
  setMessages,
  toggleEditMode,
  darkMode,
  toggleDarkMode
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [maxYHSum, setMaxYHSum] = useState(MAX_Y_H_SUM);
  const [username, setUsername] = useState('');
  const [currentLayout, setCurrentLayout] = useState(INITIAL_LAYOUT);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showTime, setShowTime] = useState(true); // showTime 상태 추가
  const originalLayoutRef = useRef(INITIAL_LAYOUT);

  const navigate = useNavigate();
  const { conversationId: urlConversationId } = useParams();

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
    const fetchUserData = async () => {
      const { valid, name } = await checkAuthStatus();
      if (valid) {
        setUsername(name);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const loadConversationMessages = async () => {
      if (urlConversationId) {
        const fetchedMessages = await fetchMessages(urlConversationId);
        setMessages(fetchedMessages);
        setSelectedConversationId(urlConversationId);
        setIsNewChat(false);
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
        // 대화 목록을 불러온 후, 마지막 대화로 이동
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
  }, [isLoggedIn]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
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
      const newConversationId = newConversationResponse.conversations[newConversationResponse.conversations.length - 1]._id;
      if (!newConversationId) {
        console.warn('No new conversation started.');
        return;
      }
      const response = await sendMessage(newConversationId, messageContent); // 새 대화 ID로 메시지 전송
  
      if (response && response.length > 0) {
        const aiMessage = {
          content: response[response.length - 1].content,
          role: 'assistant',
          createdAt: new Date().toISOString()
        };
        handleUpdateMessage(aiMessage); // AI 응답 메시지를 추가하여 상태 업데이트
      }
      setSelectedConversationId(newConversationId); // 이 부분을 수정합니다.
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

  const handleResetLayout = () => {
    setCurrentLayout(INITIAL_LAYOUT);
  };

  const handleSaveClick = () => {
    originalLayoutRef.current = currentLayout;
    toggleEditMode();
  };

  const handleCancelClick = () => {
    setCurrentLayout(originalLayoutRef.current);
    toggleEditMode();
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

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    document.body.classList.toggle('dark', !darkMode);
  };

  return (
    <main className={`main-section ${darkMode ? 'dark' : ''}`}>
      <Navigation
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        toggleEditMode={toggleEditMode}
        isEditMode={isEditMode}
        handleSaveClick={handleSaveClick}
        handleCancelClick={handleCancelClick}
        handleResetLayout={handleResetLayout}
        loadMessages={loadMessages}
        startNewConversationWithMessage={() => {
          setMessages([]); // 채팅 리스트를 초기화
          setIsNewChat(true); // 새로운 채팅 상태로 설정
        }}
        showTime={showTime} // showTime prop 전달
        setShowTime={setShowTime} // setShowTime prop 전달
        darkMode={darkMode} // 다크 모드 상태 전달
        toggleDarkMode={handleToggleDarkMode} // 다크 모드 토글 함수 전달
      />
      {isLoggedIn && (
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
              setMessages([]); // 채팅 리스트를 초기화
              setIsNewChat(true);
            }} // 새로운 채팅 시작을 위해 isNewChat을 true로 설정
            onConversationDelete={handleConversationDelete} // 삭제 후 상태 업데이트 호출
          />
        </>
      )}
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="grid-container">
          <GridLayout
            className="layout"
            layout={currentLayout}
            cols={12}
            rowHeight={(viewportHeight - 56) / 9}
            width={viewportWidth}
            isResizable={isEditMode}
            isDraggable={isEditMode}
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
              className={`grid-item chat-container ${isEditMode ? 'edit-mode' : ''} ${!isEditMode ? 'no-border' : ''}`}
              data-grid={{...currentLayout.find(item => item.i === 'chatContainer'), resizeHandles: isEditMode ? ['s', 'e', 'w', 'n'] : [] }}
            >
              <div className="chat-list-container" style={{ flexGrow: 1 }}>
                {isNewChat ? (
                  <div className="alert alert-info text-center">
                    새로운 채팅을 시작해 보세요!
                  </div>
                ) : (
                  <ChatList 
                    messages={messages} 
                    username={username || 'You'} 
                    conversationId={selectedConversationId}
                    showTime={showTime} // showTime prop 전달
                    darkMode={darkMode} // 다크 모드 상태 전달
                  />
                )}
              </div>
              <div className="chat-box-container">
                <ChatBox
                  onNewMessage={handleNewMessage}
                  onUpdateMessage={handleUpdateMessage}
                  isEditMode={isEditMode}
                  conversationId={selectedConversationId}
                  isNewChat={isNewChat}
                  startNewConversationWithMessage={startNewConversationWithMessage}
                  darkMode={darkMode} // 다크 모드 상태 전달
                />
              </div>
            </div>
          </GridLayout>
        </div>
      </div>
    </main>
  );
};

export default Home;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import Navigation from '../components/navbar/Navigation';
import GridLayout from 'react-grid-layout';
import { fetchMessages, startNewConversation, fetchConversations, sendMessage, getChatboxes, saveChatbox, resetChatbox } from '../api/axiosInstance';
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
  const [maxYHSum] = useState(MAX_Y_H_SUM);
  const [username, setUsername] = useState('');
  const [currentLayout, setCurrentLayout] = useState(INITIAL_LAYOUT);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showTime, setShowTime] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const originalLayoutRef = useRef(INITIAL_LAYOUT);

  const navigate = useNavigate();
  const { conversationId: urlConversationId } = useParams();

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
    } catch (error) {
      console.error('Chatbox layout 초기화 실패:', error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const chatbox = {
        cbox_x: currentLayout[0].x,
        cbox_y: currentLayout[0].y,
        cbox_w: currentLayout[0].w,
        cbox_h: currentLayout[0].h
      };
      await saveChatbox(chatbox);
      originalLayoutRef.current = currentLayout;
      toggleEditMode();
    } catch (error) {
      console.error('Chatbox layout 저장 실패:', error);
    }
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

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };
  useEffect(() => {
    if (darkMode === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);
  return (
    <main className={`main-section ${darkMode === 'dark' ? 'dark' : ''}`}>
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
          setMessages([]);
          setIsNewChat(true);
        }}
        showTime={showTime}
        setShowTime={setShowTime}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isPanelOpen={isPanelOpen}
        handleOpenPanel={handleOpenPanel}
        handleClosePanel={handleClosePanel}
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
              setMessages([]);
              setIsNewChat(true);
            }}
            onConversationDelete={handleConversationDelete}
            darkMode={darkMode}
          />
        </>
      )}
      <div className={`main-content ${isSidebarOpen ? 'shifted-right' : ''} ${isPanelOpen ? 'shifted-left' : ''}`}>
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
                    username={username} 
                    conversationId={selectedConversationId}
                    showTime={showTime}
                    darkMode={darkMode}
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
                  darkMode={darkMode}
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

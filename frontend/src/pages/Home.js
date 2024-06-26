import React, { useState, useCallback, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import GridLayout from 'react-grid-layout';
import { fetchMessages } from '../api/axiosInstance';
import '../css/Home/Home.css'; // 공통 CSS 파일

const Home = ({ isLoggedIn, isEditMode, isChatPage, currentLayout, setCurrentLayout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [layout, setLayout] = useState(currentLayout.length > 0 ? currentLayout : [
    { i: 'chatList', x: 0, y: 1, w: 12, h: 6, minH: 1, maxW: 16, maxH: 9 },
    { i: 'chatBox', x: 0, y: 7, w: 12, h: 3, minH: 1, maxW: 16, maxH: 2 }
  ]);

  useEffect(() => {
    if (currentLayout.length > 0) {
      setLayout(currentLayout);
    }
  }, [currentLayout]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNewMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const handleUpdateMessage = useCallback((aiMessage) => {
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const data = await fetchMessages();
      console.log('Loaded messages:', data);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadMessages();
    }
  }, [isLoggedIn, loadMessages]);

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

  const handleLayoutChange = (newLayout) => {
    const updatedLayout = newLayout.map(item => {
      if (item.y < 1) {
        item.y = 1;
      }
      return item;
    });
    setLayout(updatedLayout);
    setCurrentLayout(updatedLayout);
  };

  const handleResizeStop = (layout, oldItem, newItem) => {
    if (newItem.y < 1) {
      newItem.y = 1;
    }
    setLayout(layout.map(item => item.i === newItem.i ? newItem : item));
    setCurrentLayout(layout.map(item => item.i === newItem.i ? newItem : item));
  };

  const handleDragStop = (layout, oldItem, newItem) => {
    if (newItem.y < 1) {
      newItem.y = 1;
    }
    setLayout(layout.map(item => item.i === newItem.i ? newItem : item));
    setCurrentLayout(layout.map(item => item.i === newItem.i ? newItem : item));
  };

  useEffect(() => {
    const loadCSS = async () => {
      if (isLoggedIn) {
        try {
          const module = await import('../css/Home/HomeLogin.css');
          const cssRef = module.default;
          console.log('Logged in CSS loaded');
        } catch (error) {
          console.error('Error loading logged-in CSS:', error);
        }
      } else {
        try {
          await import('../css/Home/HomeNonLogin.css');
          console.log('Logged out CSS loaded');
        } catch (error) {
          console.error('Error loading logged-out CSS:', error);
        }
      }
    };
    loadCSS();
  }, [isLoggedIn]);

  useEffect(() => {
    const chatListContainer = document.querySelector('.chat-list-container');
    if (chatListContainer) {
      const showScrollbar = () => {
        chatListContainer.classList.add('show-scrollbar');
        clearTimeout(chatListContainer.scrollbarTimeout);
        chatListContainer.scrollbarTimeout = setTimeout(() => {
          chatListContainer.classList.remove('show-scrollbar');
        }, 1000); // 1초 동안 스크롤 바 보이기
      };

      chatListContainer.addEventListener('wheel', showScrollbar);
      chatListContainer.addEventListener('mouseenter', showScrollbar);
      chatListContainer.addEventListener('mouseleave', () => {
        chatListContainer.classList.remove('show-scrollbar');
      });

      return () => {
        chatListContainer.removeEventListener('wheel', showScrollbar);
        chatListContainer.removeEventListener('mouseenter', showScrollbar);
        chatListContainer.removeEventListener('mouseleave', () => {
          chatListContainer.classList.remove('show-scrollbar');
        });
      };
    }
  }, []);

  return (
    <main className="main-section">
      {isLoggedIn ? (
        <>
          <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isLoggedIn={isLoggedIn}
            closeSidebar={closeSidebar}
          />
          <div className={`main-content ${isSidebarOpen && isLoggedIn ? 'shifted' : ''} ${isChatPage ? 'chat-page' : ''}`}>
            <div className="grid-container">
              <GridLayout
                className="layout"
                layout={layout}
                cols={16}
                rowHeight={(viewportHeight - 56) / 9}
                width={viewportWidth}
                isResizable={isEditMode} // 설정 모드에서만 크기 조절 가능
                isDraggable={isEditMode} // 설정 모드에서만 드래그 가능
                resizeHandles={isEditMode ? ['s', 'e', 'w', 'n'] : []} // 설정 모드에서만 핸들 표시
                onLayoutChange={handleLayoutChange}
                onResizeStop={handleResizeStop}
                onDragStop={handleDragStop}
                margin={[0, 0]}
                containerPadding={[0, 0]}
                compactType={null} // 항목을 자동으로 정렬하지 않도록 설정
                preventCollision={true} // 항목 겹침 방지
                verticalCompact={false} // 자동 압축 방지
              >
                <div key="chatList" className={`grid-item chat-list-container ${isEditMode ? 'edit-mode' : ''}`}>
                  <ChatList messages={messages} />
                </div>
                <div key="chatBox" className={`grid-item chat-box-container ${isEditMode ? 'edit-mode' : ''}`}>
                  <ChatBox onNewMessage={handleNewMessage} onUpdateMessage={handleUpdateMessage} />
                </div>
              </GridLayout>
            </div>
          </div>
        </>
      ) : (
        <div className="non-login-container">
          <GridLayout
            className="layout"
            layout={[{ i: 'non-login', x: 4, y: 3.5, w: 8, h: 2 }]}
            cols={16}
            rowHeight={(viewportHeight - 56) / 9}
            width={viewportWidth}
            isResizable={false}
            isDraggable={false}
            margin={[0, 0]}
            containerPadding={[0, 0]}
          >
            <div key="non-login" className="grid-item" style={{ background: 'url("../../assets/images/background-image.png") no-repeat center center', backgroundSize: 'cover' }}>
              <Alert className="non-login-text">
                <Alert.Heading>로그인이 필요합니다.</Alert.Heading>
                <p>로그인하여 채팅을 이용해보세요!</p>
                <Button href="/login" className="middle-login-button" variant="primary">
                  <FontAwesomeIcon icon={faSignInAlt} className="icon" />
                  Login
                </Button>
              </Alert>
            </div>
          </GridLayout>
        </div>
      )}
    </main>
  );
};

export default Home;

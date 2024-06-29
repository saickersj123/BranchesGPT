import React, { useState, useEffect, useCallback } from 'react';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import GridLayout from 'react-grid-layout';
import { checkAuthStatus } from '../api/axiosInstance'; // 추가
import '../css/Home.css'; // 공통 CSS 파일

const MAX_Y_H_SUM = 9; // y와 h 값의 합의 최댓값을 전역 변수로 설정
const test_X_Y_coordinates = false; // true일 경우 chatlist, chatbox의 좌표가 보임

const INITIAL_LAYOUT = [
  { i: 'chatList', x: 2, y: 0, w: 8, h: 7, minH: 3, maxW: 16, maxH: 7.5 },
  { i: 'chatBox', x: 2, y: 6, w: 8, h: 1.5, minH: 1.5, minW: 3, maxW: 16, maxH: 1.5 }
];

const Home = ({ isLoggedIn, user, isEditMode, isChatPage, currentLayout, setCurrentLayout, loadMessages, messages, setMessages, onNewChat }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [maxYHSum, setMaxYHSum] = useState(MAX_Y_H_SUM); // state로 관리하여 상단에서 조절 가능
  const [username, setUsername] = useState(''); // 추가

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNewMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, [setMessages]);

  const handleUpdateMessage = useCallback((aiMessage) => {
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  }, [setMessages]);

  const validateLayout = (layout) => {
    const occupiedPositions = new Set();
    return layout.map(item => {
      let { x, y, w, h } = item;
      if (y < 0) y = 0; // Ensure y is not negative
      if (y + h > maxYHSum) y = 0; // Move to top if y + h exceeds maxYHSum
      while (isPositionOccupied(x, y, w, h, occupiedPositions)) {
        x = (x + 1) % 12; // Adjust x to avoid overlap
        if (x === 0) {
          y = (y + 1) % maxYHSum; // Adjust y to avoid overlap and stay within maxYHSum
        }
        if (y + h > maxYHSum) {
          y = 0; // Move to top if y + h exceeds maxYHSum
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

  // 새로운 채팅 버튼 클릭 시 호출되는 함수
  useEffect(() => {
    if (onNewChat) {
      console.log('The button in the new chat has been clicked.');
    }
  }, [onNewChat]);

  return (
    <main className="main-section">
      <>
        <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isLoggedIn={isLoggedIn}
          closeSidebar={closeSidebar}
        />
        <div className={`main-content ${isSidebarOpen ? 'shifted' : ''} ${isChatPage ? 'chat-page' : ''}`}>
          <div className="grid-container">
            <GridLayout
              className="layout"
              layout={currentLayout}
              cols={12} // 그리드 항목을 12열로 설정
              rowHeight={(viewportHeight - 56) / 9} // 네비게이션바 높이를 고려
              width={viewportWidth} // 전체 너비 사용
              isResizable={isEditMode} // 설정 모드에서만 크기 조절 가능
              isDraggable={isEditMode} // 설정 모드에서만 드래그 가능
              onLayoutChange={handleLayoutChange}
              onResizeStop={handleResizeStop}
              onDragStop={handleDragStop}
              margin={[0, 0]} // 그리드 항목 간의 margin을 0으로 설정
              containerPadding={[0, 0]} // 그리드 전체의 padding을 0으로 설정
              compactType={null} // 자동 정렬 비활성화
              preventCollision={true} // 항목 겹침 방지
              verticalCompact={false} // 자동 압축 비활성화
            >
              <div 
                key="chatList" 
                className={`grid-item chat-list-container ${isEditMode ? 'edit-mode' : ''}`} 
                data-grid={{...currentLayout.find(item => item.i === 'chatList'), resizeHandles: isEditMode ? ['s', 'e', 'w', 'n'] : [] }}
              >
                <ChatList messages={messages} username={username || 'You'} />
              </div>
              <div 
                key="chatBox" 
                className={`grid-item chat-box-container ${isEditMode ? 'edit-mode' : ''}`} 
                data-grid={{...currentLayout.find(item => item.i === 'chatBox'), resizeHandles: isEditMode ? ['e', 'w'] : [] }}
              >
                <ChatBox 
                  onNewMessage={handleNewMessage} 
                  onUpdateMessage={handleUpdateMessage} 
                  isEditMode={isEditMode} 
                />
              </div>
            </GridLayout>
          </div>
          {test_X_Y_coordinates && (
            <div className="layout-info">
              {currentLayout.map(item => (
                <div key={item.i}>
                  {item.i}: (x: {item.x}, y: {item.y}, w: {item.w}, h: {item.h})
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    </main>
  );
};

export default Home;

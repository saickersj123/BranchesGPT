import React, { useState } from 'react';
import '../css/App.css'; // 필요한 경우 별도의 CSS 파일
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Navigation from '../components/navbar/Navigation'; // Navigation 컴포넌트 임포트

// 함수 표현식으로 sendMessage 함수 정의
const sendMessage = (message) => {
  console.log('전송된 메시지:', message);
};

// 함수 컴포넌트 Home 정의
const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main className="main-section">
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} toggleSidebar={toggleSidebar} />
      {isLoggedIn ? (
        <>
          <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isLoggedIn={isLoggedIn} />
          <div className={`main-content ${isSidebarOpen && isLoggedIn ? 'shifted' : ''}`}>
            <div className="ChatList"> {/* ChatList의 공간 */}
              <ChatList />
            </div>
            <div className="ChatBoxFixed"> {/* ChatBox를 고정하는 영역 */}
              <ChatBox sendMessage={sendMessage} />
            </div>
          </div>
        </>
      ) : (
        <Alert variant="danger" className="text-center" style={{ borderRadius: '10px' }}>
          <Alert.Heading>
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            {' '}로그인이 필요합니다.
          </Alert.Heading>
          <p>
            로그인하여 채팅을 이용해보세요!
          </p>
        </Alert>
      )}
    </main>
  );
};

export default Home;

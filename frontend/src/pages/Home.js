import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import Navigation from '../components/navbar/Navigation';
import '../css/App.css';
import '../css/Home.css';

const sendMessage = (message, roomId) => {
  console.log('전송된 메시지:', message, '방 ID:', roomId);
};

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const { roomId } = useParams();  // roomId를 URL에서 가져옴
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <main className="main-section">
      <Navigation 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        toggleSidebar={toggleSidebar} 
        closeSidebar={closeSidebar} 
      />
      {isLoggedIn ? (
        <>
          <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
          <Sidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
            isLoggedIn={isLoggedIn} 
            closeSidebar={closeSidebar} 
          />
          <div className={`main-content ${isSidebarOpen && isLoggedIn ? 'shifted' : ''}`}>
            <div className="ChatList">
              <ChatList roomId={roomId} />
            </div>
            <div className="ChatBoxFixed">
              <ChatBox roomId={roomId} />
            </div>
          </div>
        </>
      ) : (
        <Alert className="non_login_text">
          <Alert.Heading>
            로그인이 필요합니다.
          </Alert.Heading>
          <p>
            로그인하여 채팅을 이용해보세요!
          </p>
          <Button href="/login" className="middle-login-button" variant="primary">
            <FontAwesomeIcon icon={faSignInAlt} className="icon" />
            Login
          </Button>
        </Alert>
      )}
    </main>
  );
};

export default Home;

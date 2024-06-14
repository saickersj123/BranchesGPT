import React, { useState, useCallback, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import Navigation from '../components/navbar/Navigation';
import '../css/App.css';
import '../css/Home.css';
import { fetchMessages } from '../api/axiosInstance';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);

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
              <ChatList messages={messages} />
            </div>
            <div className="ChatBoxFixed">
              <ChatBox onNewMessage={handleNewMessage} onUpdateMessage={handleUpdateMessage} />
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

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './css/App.css';
import Navigation from './components/navbar/Navigation';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Home from './pages/Home';
import Pretrain from './pages/Pretrain'; 
import { checkAuthStatus, fetchMessages } from './api/axiosInstance';  

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // 유저 정보 상태 추가
  const [isEditMode, setIsEditMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // 다크 모드 상태 추가 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus(); 
        setIsLoggedIn(response.valid);
        if (response.valid) {
          setUser(response.user); // 유저 정보 저장
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(prevEditMode => !prevEditMode);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const data = await fetchMessages(conversationId);
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

  const startNewChat = () => {
    console.log('The button in the new chat has been clicked.');
  };

  return (
    <Router>
      <Navigation 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        toggleEditMode={toggleEditMode} 
        isEditMode={isEditMode} 
        loadMessages={loadMessages}
        startNewConversationWithMessage={startNewChat}
        darkMode={darkMode} // 다크 모드 상태 전달
        toggleDarkMode={toggleDarkMode} // 다크 모드 토글 함수 전달
      />
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="*" element={
          <div className={`app-container ${darkMode ? 'dark' : ''}`}>
            <div className="main-content">
              <Routes>
                <Route path="/" element={
                  <Home 
                    isLoggedIn={isLoggedIn} 
                    setIsLoggedIn={setIsLoggedIn}  
                    user={user}  
                    isEditMode={isEditMode} 
                    loadMessages={loadMessages}
                    messages={messages}
                    setMessages={setMessages}
                    toggleEditMode={toggleEditMode}
                    startNewChat={startNewChat}
                    darkMode={darkMode} // 다크 모드 상태 전달
                    toggleDarkMode={toggleDarkMode} // 다크 모드 토글 함수 전달
                  />
                } />
                <Route path="/chat/:conversationId" element={
                  <Home 
                    isLoggedIn={isLoggedIn} 
                    setIsLoggedIn={setIsLoggedIn}
                    user={user}
                    isEditMode={isEditMode}
                    loadMessages={loadMessages}
                    messages={messages}
                    setMessages={setMessages}
                    toggleEditMode={toggleEditMode}
                    startNewChat={startNewChat}
                    darkMode={darkMode} // 다크 모드 상태 전달
                    toggleDarkMode={toggleDarkMode} // 다크 모드 토글 함수 전달
                  />
                } />
                <Route path="/mypage" element={isLoggedIn ? <MyPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/" />} />
                <Route path="/pretrain" element={<Pretrain />} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;

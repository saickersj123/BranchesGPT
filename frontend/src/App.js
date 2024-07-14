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
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
      return savedMode;
    } else {
      localStorage.setItem('mode', 'system');
      return 'system';
    }
  });

  const getSystemMode = () => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? 'dark' : 'light';
  };

  const getCurrentMode = () => {
    return mode === 'system' ? getSystemMode() : mode;
  };

  const currentMode = getCurrentMode();

  useEffect(() => {
    const root = document.documentElement;
    if (currentMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    return () => {
      root.classList.remove('dark');
      root.classList.remove('light');
    };
  }, [currentMode]);

  const toggleDarkMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus();
        setIsLoggedIn(response.valid);
        if (response.valid) {
          setUser(response.user);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const toggleEditMode = () => {
    setIsEditMode((prevEditMode) => !prevEditMode);
  };

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const data = await fetchMessages(conversationId);
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
  };

  return (
    <Router>
      <div>
        <Navigation
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          toggleEditMode={toggleEditMode}
          isEditMode={isEditMode}
          loadMessages={loadMessages}
          startNewConversationWithMessage={startNewChat}
          darkMode={currentMode}
          toggleDarkMode={toggleDarkMode}
        />
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} darkMode={currentMode} toggleDarkMode={toggleDarkMode} />} />
          <Route
            path="*"
            element={
              <div  className={`app-container ${currentMode}`}>
                <Routes>
                  <Route
                    path="/"
                    element={
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
                        darkMode={currentMode}
                        toggleDarkMode={toggleDarkMode}
                      />
                    }
                  />
                  <Route
                    path="/chat/:conversationId"
                    element={
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
                        darkMode={currentMode}
                        toggleDarkMode={toggleDarkMode}
                      />
                    }
                  />
                  <Route
                    path="/mypage"
                    element={isLoggedIn ? <MyPage darkMode={currentMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/" />}
                  />
                  <Route path="/pretrain" element={<Pretrain darkMode={currentMode} toggleDarkMode={toggleDarkMode} />} />
                </Routes>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

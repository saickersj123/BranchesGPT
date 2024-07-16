import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './css/App.css';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Home from './pages/Home';
import Pretrain from './pages/Pretrain';
import {  checkAuthStatus,
          fetchMessages, 
          getModelConversation, } from './api/axiosInstance';

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

  const loadModelMessages = useCallback(async (modelId, conversationId) => {
    try {
      const data = await getModelConversation(modelId, conversationId);
      console.log(data);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);
  
  const startNewChat = () => {
    
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route
            path="*"
            element={
              <div  className={`app-container`}>
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
                        loadModelMessages={loadModelMessages}
                        messages={messages}
                        setMessages={setMessages}
                        toggleEditMode={toggleEditMode}
                        startNewChat={startNewChat}

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
                        loadModelMessages={loadModelMessages}
                        messages={messages}
                        setMessages={setMessages}
                        toggleEditMode={toggleEditMode}
                        startNewChat={startNewChat}
                      />
                    }
                  />
                  <Route       
                    path="/chat/:modelId/:conversationId"
                    element={
                      <Home
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        user={user}
                        isEditMode={isEditMode}
                        loadMessages={loadMessages}
                        loadModelMessages={loadModelMessages}
                        messages={messages}
                        setMessages={setMessages}
                        toggleEditMode={toggleEditMode}
                        startNewChat={startNewChat}
                      />
                    }
                  />
                  <Route
                    path="/mypage"
                  />  
                  <Route path="/pretrain" />
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

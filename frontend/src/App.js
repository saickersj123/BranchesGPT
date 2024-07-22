import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Home from './pages/Home';
import MainPage from './pages/MainPage';
import Signup from './pages/Signup';
import {  checkAuthStatus, 
          fetchMessages, 
          } from './api/axiosInstance';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [setIsLayoutEditing] = useState(false);
  const [messages, setMessages] = useState([]);

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

  const toggleLayoutEditing = () => {
    setIsLayoutEditing((prevLayoutEditing) => !prevLayoutEditing);
  };

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const data = await fetchMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route
            path="*"
            element={
              <div className={`app-container`}>
                <Routes>
                  <Route
                    path="/chat"
                    element={
                      <Home
                      isLoggedIn={isLoggedIn}
                      setIsLoggedIn={setIsLoggedIn}
                      user={user}
                      isLayoutEditing={setIsLayoutEditing}
                      loadMessages={loadMessages}
                      messages={messages}
                      setMessages={setMessages}
                      toggleLayoutEditing={toggleLayoutEditing}
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
                        isLayoutEditing={setIsLayoutEditing}
                        loadMessages={loadMessages}
                        messages={messages}
                        setMessages={setMessages}
                        toggleLayoutEditing={toggleLayoutEditing}
                        
                      />
                    }
                  />
                  <Route
                    path="/mypage" element={
                      <MyPage 
                        user={user} 
                        setUser={setUser} 
                        setIsLoggedIn={setIsLoggedIn}
                      />
                    }
                  />  
                  
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

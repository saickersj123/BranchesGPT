import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Home from './pages/Home';
import {  checkAuthStatus, 
          fetchMessages, 
          fetchModelConversation,
          fetchModelConversations 
          } from './api/axiosInstance';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLayoutEditing, setIsLayoutEditing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);


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

  const loadModelMessages = async (modelId, conversationId) => {
    try {
      const data = await fetchModelConversation(modelId, conversationId);
      console.log(data);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadModelConversations = async (modelId) => {
    try {
      const data = await fetchModelConversations(modelId);
      setConversations(Array.isArray(data) ? data : []);
      if (data.length > 0) {
        const mostRecentConversation = data[data.length-1]._id; // Assuming the most recent conversation is at index 0
        await loadModelMessages(modelId, mostRecentConversation); // Load messages for the most recent conversation
      }
    } catch (error) {
      console.error('Error fetching model conversations:', error);
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route
            path="*"
            element={
              <div className={`app-container`}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        user={user}
                        isLayoutEditing={setIsLayoutEditing}
                        messages={messages}
                        setMessages={setMessages}
                        toggleLayoutEditing={toggleLayoutEditing}
                        loadModelMessages={loadModelMessages}
                        loadModelConversations={loadModelConversations}
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
                        loadModelMessages={loadModelMessages}
                        messages={messages}
                        setMessages={setMessages}
                        toggleLayoutEditing={toggleLayoutEditing}
                        
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
                        isLayoutEditing={setIsLayoutEditing}
                        loadMessages={loadMessages}
                        loadModelMessages={loadModelMessages}
                        messages={messages}
                        setMessages={setMessages}
                        toggleLayoutEditing={toggleLayoutEditing}
                        loadModelConversations={loadModelConversations}
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

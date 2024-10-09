import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Home from './pages/Home';
import MainPage from './pages/MainPage';
import Signup from './pages/Signup';
import { checkAuthStatus, fetchMessages } from './api/axiosInstance';
import { Message } from './types';  // types.ts에서 Message 인터페이스를 import

interface User {
  name: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLayoutEditing, setIsLayoutEditing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>('');
  const [nicknameChanged, setNicknameChanged] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus();
        setIsLoggedIn(response.valid);
        if (response.valid && response.user) {
          setUser(response.user);
          setUsername(response.user.name);
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

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);  // 여기서 타입 체크가 정확히 이루어져야 합니다.
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
                        isLayoutEditing={isLayoutEditing}
                        loadMessages={loadMessages}
                        messages={messages}
                        setMessages={setMessages}
                        toggleLayoutEditing={toggleLayoutEditing}
                        username={username}
                        setUsername={setUsername}
                        nicknameChanged={nicknameChanged}
                        setNicknameChanged={setNicknameChanged}
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
                        isLayoutEditing={isLayoutEditing}
                        loadMessages={loadMessages}
                        messages={messages}
                        setMessages={setMessages}
                        toggleLayoutEditing={toggleLayoutEditing}
                        username={username}
                        setUsername={setUsername}
                        nicknameChanged={nicknameChanged}
                        setNicknameChanged={setNicknameChanged}
                      />
                    }
                  />
                  <Route
                    path="/mypage" 
                    element={
                      <MyPage 
                        user={user} 
                        setUser={setUser} 
                        setIsLoggedIn={setIsLoggedIn}
                        username={username}  
                        setUsername={setUsername}
                        setNicknameChanged={setNicknameChanged}
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
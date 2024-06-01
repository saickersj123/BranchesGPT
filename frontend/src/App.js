import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { checkAuthStatus } from './api/axiosInstance';  // 추가된 부분
import './css/App.css';
import Navigation from './components/navbar/Navigation';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Home from './pages/Home';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedIsLoggedIn = sessionStorage.getItem('isLoggedIn');
    return savedIsLoggedIn === 'true';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const verifyAuthStatus = async () => {
      if (isLoggedIn) {
        try {
          const response = await checkAuthStatus();
          if (!response.valid) {
            setIsLoggedIn(false);
            sessionStorage.setItem('isLoggedIn', 'false');
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          setIsLoggedIn(false);
          sessionStorage.setItem('isLoggedIn', 'false');
        }
      }
    };
    verifyAuthStatus();
  }, [isLoggedIn]);

  useEffect(() => {
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" /> : <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/mypage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} />
            <Route path="/chat/:roomId" element={isLoggedIn ? <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} /> {/* Home으로 라우트 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

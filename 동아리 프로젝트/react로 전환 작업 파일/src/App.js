import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './css/App.css';
import Navigation from './components/navbar/Navigation';
import Sidebar from './components/sidebar/Sidebar';
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
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="app-container">
        {isLoggedIn && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isLoggedIn={isLoggedIn} />}
        <div className={`main-content ${isSidebarOpen && isLoggedIn ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" /> : <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/mypage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

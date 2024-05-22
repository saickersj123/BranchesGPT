// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './css/App.css';
import Navigation from './components/navbar/Navigation';
import Footer from './components/Footer';
import Contact from './pages/ChatContact';
import Terms from './pages/Terms';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Home from './pages/Home';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return savedIsLoggedIn === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/mypage" element={isLoggedIn ? <MyPage /> : <Navigate to="/" />} />
        {/* isLoggedIn이 false인 경우 "/"로 리다이렉트 */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

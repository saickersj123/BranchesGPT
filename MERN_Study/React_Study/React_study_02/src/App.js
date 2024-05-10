import './App.css'; // App 컴포넌트에서 사용할 CSS 파일을 가져옵니다.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // React Router의 필수 요소를 가져옵니다.
import HomePage from './pages/HomePage'; // 홈 페이지 컴포넌트를 가져옵니다.
import Navigation from './components/navbar/Navigation'; // 네비게이션 바 컴포넌트를 가져옵니다.
import LectureOne from './pages/lecture1/LectureOne'; // LectureOne 페이지 컴포넌트를 가져옵니다.

function App() {
  return (
    <div className="App">{ /* App 컴포넌트의 렌더링을 시작합니다. */ }
      { /* 브라우저 라우팅을 설정합니다. */ }
      <Router>
        { /* 네비게이션 바를 렌더링합니다. */ }
        <Navigation />
        { /* 라우트 설정을 위한 Routes 컴포넌트를 사용합니다. */ }
        <Routes>
          { /* 홈 페이지에 대한 라우트 설정 */ }
          <Route path="/" element={<HomePage />} />
          { /* LectureOne 페이지에 대한 라우트 설정 */ }
          <Route path="/lectureOne" element={<LectureOne />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App; // App 컴포넌트를 내보냅니다.

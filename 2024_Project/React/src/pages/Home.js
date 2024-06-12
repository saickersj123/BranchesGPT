import React, { useState } from 'react'; // React와 useState 훅을 가져옴
import { useParams } from 'react-router-dom'; // URL 파라미터를 접근하기 위해 useParams 훅을 가져옴
import { Button, Alert } from 'react-bootstrap'; // react-bootstrap에서 Button과 Alert 컴포넌트를 가져옴
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 컴포넌트를 가져옴
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'; // 특정 FontAwesome 아이콘을 가져옴
import ChatBox from '../components/ChatBox'; // ChatBox 컴포넌트를 가져옴
import ChatList from '../components/ChatList'; // ChatList 컴포넌트를 가져옴
import Sidebar from '../components/sidebar/Sidebar'; // Sidebar 컴포넌트를 가져옴
import Navigation from '../components/navbar/Navigation'; // Navigation 컴포넌트를 가져옴
import '../css/App.css'; // 전역 CSS 파일을 가져옴
import '../css/Home.css'; // Home 컴포넌트에 특정한 CSS 파일을 가져옴

const sendMessage = (message, roomId) => { // 메시지 내용과 roomId로 메시지를 전송하는 함수
  console.log('전송된 메시지:', message, '방 ID:', roomId); // 콘솔에 메시지와 roomId를 출력
};

const Home = ({ isLoggedIn, setIsLoggedIn }) => { // isLoggedIn과 setIsLoggedIn을 props로 받는 Home 컴포넌트
  const { roomId } = useParams();  // URL 파라미터에서 roomId를 가져옴
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 열림/닫힘 상태를 관리하는 상태

  const toggleSidebar = () => { // 사이드바 열림/닫힘 상태를 토글하는 함수
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => { // 사이드바를 닫는 함수
    setIsSidebarOpen(false);
  };

  return (
    <main className="main-section"> {/* 페이지의 메인 섹션 */}
      <Navigation 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        toggleSidebar={toggleSidebar} 
        closeSidebar={closeSidebar} 
      /> {/* 네비게이션 바 컴포넌트 */}
      {isLoggedIn ? ( // 로그인 상태에 따른 조건부 렌더링
        <>
          <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div> {/* 사이드바 오버레이 */}
          <Sidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
            isLoggedIn={isLoggedIn} 
            closeSidebar={closeSidebar} 
          /> {/* 사이드바 컴포넌트 */}
          <div className={`main-content ${isSidebarOpen && isLoggedIn ? 'shifted' : ''}`}> {/* 사이드바가 열릴 때 이동하는 메인 콘텐츠 영역 */}
            <div className="ChatList">
              <ChatList roomId={roomId} /> {/* roomId에 대한 채팅 목록을 표시하는 ChatList 컴포넌트 */}
            </div>
            <div className="ChatBoxFixed">
              <ChatBox roomId={roomId} /> {/* roomId에서 메시지를 보내는 ChatBox 컴포넌트 */}
            </div>
          </div>
        </>
      ) : ( // 로그인하지 않은 경우 로그인 프롬프트를 표시
        <Alert className="non_login_text">
          <Alert.Heading>
            로그인이 필요합니다. {/* 로그인 알림 제목 */}
          </Alert.Heading>
          <p>
            로그인하여 채팅을 이용해보세요! {/* 채팅 이용을 위한 로그인 안내 */}
          </p>
          <Button href="/login" className="middle-login-button" variant="primary">
            <FontAwesomeIcon icon={faSignInAlt} className="icon" /> {/* FontAwesome 로그인 아이콘 */}
            Login {/* 버튼 텍스트 */}
          </Button>
        </Alert>
      )}
    </main>
  );
};

export default Home; // Home 컴포넌트를 기본으로 내보냄

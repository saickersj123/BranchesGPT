import React from 'react';
import '../App.css'; // 필요한 경우 별도의 CSS 파일
import ChatBox from './ChatBox';
import ChatList from './ChatList';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

// 함수 표현식으로 sendMessage 함수 정의
const sendMessage = (message) => {
  // 클라이언트 측에서 전송한 메시지를 여기서 처리합니다.
  // 이 예시에서는 간단히 콘솔에 출력합니다.
  console.log('전송된 메시지:', message);
};

// 함수 컴포넌트 Home 정의
const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <main className="main-section">
      {isLoggedIn ? (
        // 로그인이 되면 보이는 창
        <>
          <div className="ChatList"> {/* ChatList의 공간 */}
            <ChatList />
          </div>
          <div>
            <ChatBox sendMessage={sendMessage} />
          </div>
        </>
      ) : (
        // 로그인이 되지 않았을 경우 보여지는 창
        <Alert variant="danger" className="text-center" style={{ borderRadius: '10px' }}>
          <Alert.Heading>
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            {' '}로그인이 필요합니다.
          </Alert.Heading>
          <p>
            로그인하여 채팅을 이용해보세요!
          </p>
        </Alert>
      )}
    </main>
  );
};

export default Home;

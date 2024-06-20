import React, { useEffect, useState } from 'react'; // React, useEffect, useState를 가져옵니다.
import Container from 'react-bootstrap/Container'; // react-bootstrap의 Container 컴포넌트를 가져옵니다.
import Nav from 'react-bootstrap/Nav'; // react-bootstrap의 Nav 컴포넌트를 가져옵니다.
import Navbar from 'react-bootstrap/Navbar'; // react-bootstrap의 Navbar 컴포넌트를 가져옵니다.
import Dropdown from 'react-bootstrap/Dropdown'; // react-bootstrap의 Dropdown 컴포넌트를 가져옵니다.
import { Link } from 'react-router-dom'; // react-router-dom의 Link 컴포넌트를 가져옵니다.
import { logout } from '../../api/axiosInstance'; // 로그아웃 기능을 위한 logout 함수를 가져옵니다.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 컴포넌트를 가져옵니다.
import { faBars } from '@fortawesome/free-solid-svg-icons'; // faBars 아이콘을 가져옵니다.
import { FiMoreVertical } from 'react-icons/fi'; // fiMoreVertical 아이콘을 가져옵니다.
import { useMediaQuery } from 'react-responsive'; // 미디어 쿼리를 위한 useMediaQuery 훅을 가져옵니다.
import '../../css/Navigation.css'; // 네비게이션 스타일을 위한 CSS 파일을 가져옵니다.

const Navigation = ({ isLoggedIn, setIsLoggedIn, toggleSidebar, closeSidebar }) => { // Navigation 컴포넌트를 정의합니다.
  const [navbarHeight, setNavbarHeight] = useState(0); // 네비게이션 바의 높이를 관리하는 상태를 정의합니다.
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 관리하는 상태를 정의합니다.
  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' }); // 화면이 모바일인지 확인하는 미디어 쿼리를 정의합니다.

  useEffect(() => { // 컴포넌트가 마운트될 때 실행되는 useEffect 훅을 정의합니다.
    const navbar = document.querySelector('.navbar'); // 네비게이션 바 요소를 선택합니다.
    if (navbar) { // 네비게이션 바 요소가 존재하면,
      const height = navbar.offsetHeight; // 네비게이션 바의 높이를 가져옵니다.
      setNavbarHeight(height); // 가져온 높이를 상태에 설정합니다.
    }
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행되도록 합니다.

  const handleLogout = async () => { // 로그아웃을 처리하는 비동기 함수 handleLogout을 정의합니다.
    setIsLoading(true); // 로딩 상태를 true로 설정합니다.
    try {
      await logout(); // 로그아웃 함수를 호출합니다.
    } catch (error) {
      console.error('로그아웃 실패:', error); // 로그아웃 실패 시 콘솔에 에러를 출력합니다.
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.'); // 사용자에게 로그아웃 실패 메시지를 알립니다.
    } finally {
      setIsLoading(false); // 로딩 상태를 false로 설정합니다.
      setIsLoggedIn(false); // 로그인 상태를 false로 설정합니다.
      sessionStorage.removeItem('isLoggedIn'); // 세션 스토리지에서 로그인 상태를 제거합니다.
      if (isMobile) { // 모바일 화면이라면,
        closeSidebar(); // 사이드바를 닫습니다.
      }
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary fixed-top justify-content-between"> {/* 네비게이션 바를 렌더링합니다. */}
      <Container className="d-flex justify-content-between align-items-center"> {/* 네비게이션 바의 컨테이너를 설정합니다. */}
        {isMobile ? ( // 모바일 화면인지 여부를 확인합니다.
          <>
            {isLoggedIn && ( // 사용자가 로그인한 상태인지 확인합니다.
              <button className="menu-button" onClick={toggleSidebar}> {/* 사이드바를 토글하는 버튼을 렌더링합니다. */}
                <FontAwesomeIcon icon={faBars} /> {/* faBars 아이콘을 렌더링합니다. */}
              </button>
            )}
            <Navbar.Brand href="/" className="mx-auto">Branch-GPT</Navbar.Brand> {/* 네비게이션 바의 브랜드를 렌더링합니다. */}
            {isLoggedIn && ( // 사용자가 로그인한 상태인지 확인합니다.
              <Dropdown align="end"> {/* 오른쪽에 정렬된 드롭다운 메뉴를 렌더링합니다. */}
                <Dropdown.Toggle variant="success" id="dropdown-basic" className="custom-dropdown-toggle"> {/* 드롭다운 토글 버튼을 렌더링합니다. */}
                  <FiMoreVertical /> {/* fiMoreVertical 아이콘을 렌더링합니다. */}
                </Dropdown.Toggle>
                <Dropdown.Menu> {/* 드롭다운 메뉴를 렌더링합니다. */}
                  <Dropdown.Item as={Link} to="/mypage" onClick={closeSidebar}>마이페이지</Dropdown.Item> {/* 마이페이지 링크를 렌더링합니다. */}
                  <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item> {/* 로그아웃 항목을 렌더링합니다. */}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </>
        ) : ( // 데스크탑 화면인 경우,
          <>
            <Navbar.Brand href="/">Branch-GPT</Navbar.Brand> {/* 네비게이션 바의 브랜드를 렌더링합니다. */}
            <Navbar.Toggle aria-controls="responsive-navbar-nav" /> {/* 네비게이션 바를 토글하는 버튼을 렌더링합니다. */}
            <Navbar.Collapse id="responsive-navbar-nav"> {/* 네비게이션 바의 collapsible 부분을 렌더링합니다. */}
              <Nav className="me-auto"></Nav> {/* 왼쪽 정렬된 Nav를 렌더링합니다. */}
              <Nav>
                {!isLoggedIn ? ( // 사용자가 로그인하지 않은 상태인지 확인합니다.
                  <Nav.Link as={Link} to="/login">로그인</Nav.Link> // {/* 로그인 링크를 렌더링합니다. */}
                ) : (
                  <>
                    <Nav.Link as={Link} to="/mypage">마이페이지</Nav.Link> {/* 마이페이지 링크를 렌더링합니다. */}
                    <Nav.Link onClick={handleLogout}> {/* 로그아웃 링크를 렌더링합니다. */}
                      {isLoading ? '로그아웃 중...' : '로그아웃'} {/* 로딩 상태에 따라 로그아웃 중... 또는 로그아웃 텍스트를 렌더링합니다. */}
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
      <div style={{ paddingTop: navbarHeight }} /> {/* 네비게이션 바 높이만큼의 여백을 만듭니다. */}
    </Navbar>
  );
};

export default Navigation; // Navigation 컴포넌트를 기본 내보내기로 설정합니다.

import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { TbLayoutSidebar } from "react-icons/tb";
import { LuPenSquare } from "react-icons/lu";
import { faPalette, faRightFromBracket, faSquareMinus, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import Sidebar from '../components/sidebar/Sidebar';
import GridLayout from 'react-grid-layout';
import { logout } from '../api/axiosInstance';
import { Dropdown } from 'react-bootstrap';
import { fetchMessages, fetchConversations, getChatboxes, saveChatbox, resetChatbox } from '../api/axiosInstance';
import '../css/Home.css';
import LoginModal from '../components/LoginModal';
import ColorPickerPanel from '../components/ColorPickerPanel';
import { saveSidebarState, loadSidebarState } from '../utils/sidebarUtils';
import { Message, Conversation } from '../types';

interface HomeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: { name: string } | null;
  isLayoutEditing: boolean;
  loadMessages: (conversationId: string) => Promise<void>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  toggleLayoutEditing: () => void;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  nicknameChanged: boolean;
  setNicknameChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minH?: number;
  minW?: number;
  maxW?: number;
  maxH?: number;
}

const MAX_Y_H_SUM = 9;
const DEFAULT_MODEL = "gpt-3.5-turbo";
const INITIAL_LAYOUT: LayoutItem[] = [
  { i: 'chatContainer', x: 2, y: 0.5, w: 8, h: 8, minH: 4, minW: 3, maxW: 12, maxH: 9 }
];

const Home: React.FC<HomeProps> = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  username,
  setUsername,
  nicknameChanged,
  setNicknameChanged
}) => {
  const sidebarRef = useRef<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [maxYHSum] = useState<number>(MAX_Y_H_SUM); 
  const [currentLayout, setCurrentLayout] = useState<LayoutItem[]>(INITIAL_LAYOUT);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const originalLayoutRef = useRef<LayoutItem[]>(INITIAL_LAYOUT);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { conversationId: urlConversationId } = useParams<{ conversationId: string }>();
  const [isColorPickerPanelOpen, setIsColorPickerPanelOpen] = useState<boolean>(false);
  const [myChatBubbleColor, setMyChatBubbleColor] = useState<string>('#DCF8C6');
  const [myChatTextColor, setMyChatTextColor] = useState<string>('#000000');
  const [otherChatBubbleColor, setOtherChatBubbleColor] = useState<string>('#F0F0F0');
  const [otherChatTextColor, setOtherChatTextColor] = useState<string>('#000000');
  const [chatBubbleBold, setChatBubbleBold] = useState<boolean>(false);
  const [chatBubbleShadow, setChatBubbleShadow] = useState<boolean>(false);
  const [chatContainerBgColor, setChatContainerBgColor] = useState<string>('#FFFFFF');
  const [timeBold, setTimeBold] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [previousSidebarState, setPreviousSidebarState] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLayoutEditing, setIsLayoutEditing] = useState<boolean>(false);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const fetchedMessages = await fetchMessages(conversationId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    const loadConversationMessages = async () => {
      if (urlConversationId) {
        try {
          await loadMessages(urlConversationId);
          setSelectedConversationId(urlConversationId);
          setIsNewChat(false);
        } catch (error) {
          console.error('Error loading conversation messages:', error);
        }
      }
    };

    loadConversationMessages();
  }, [urlConversationId, loadMessages]);

  useEffect(() => {
    document.documentElement.style.setProperty('--my-chat-bubble-color', myChatBubbleColor);
    document.documentElement.style.setProperty('--my-chat-text-color', myChatTextColor);
    document.documentElement.style.setProperty('--other-chat-bubble-color', otherChatBubbleColor);
    document.documentElement.style.setProperty('--other-chat-text-color', otherChatTextColor);
    document.documentElement.style.setProperty('--chat-bubble-bold', chatBubbleBold ? 'bold' : 'normal');
    document.documentElement.style.setProperty('--chat-bubble-shadow', chatBubbleShadow ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none');
    document.documentElement.style.setProperty('--chat-container-bg-color', chatContainerBgColor);
    document.documentElement.style.setProperty('--time-bold', timeBold ? 'bold' : 'normal');
  }, [myChatBubbleColor, myChatTextColor, otherChatBubbleColor, otherChatTextColor, chatBubbleBold, chatBubbleShadow, chatContainerBgColor, timeBold]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchConversations();
        setConversations(fetchedConversations);

        if (fetchedConversations.length === 0) {
          setIsNewChat(true);
        } else if (fetchedConversations.length > 0 && !urlConversationId) {
          setSelectedConversationId(fetchedConversations[fetchedConversations.length-1]._id);
          navigate(`/chat/${fetchedConversations[fetchedConversations.length-1]._id}`);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };

    if (isLoggedIn) {
      loadConversations();
    }
  }, [isLoggedIn, navigate, urlConversationId]);

  useEffect(() => {
    const loadStyleSettings = () => {
      const settings = {
        myChatBubbleColor: localStorage.getItem('myChatBubbleColor'),
        myChatTextColor: localStorage.getItem('myChatTextColor'),
        otherChatBubbleColor: localStorage.getItem('otherChatBubbleColor'),
        otherChatTextColor: localStorage.getItem('otherChatTextColor'),
        chatContainerBgColor: localStorage.getItem('chatContainerBgColor'),
        chatBubbleBold: JSON.parse(localStorage.getItem('chatBubbleBold') || 'false'),
        chatBubbleShadow: JSON.parse(localStorage.getItem('chatBubbleShadow') || 'false'),
        timeBold: JSON.parse(localStorage.getItem('timeBold') || 'false'),
      };

      if (settings.myChatBubbleColor) setMyChatBubbleColor(settings.myChatBubbleColor);
      if (settings.myChatTextColor) setMyChatTextColor(settings.myChatTextColor);
      if (settings.otherChatBubbleColor) setOtherChatBubbleColor(settings.otherChatBubbleColor);
      if (settings.otherChatTextColor) setOtherChatTextColor(settings.otherChatTextColor);
      if (settings.chatContainerBgColor) setChatContainerBgColor(settings.chatContainerBgColor);
      setChatBubbleBold(settings.chatBubbleBold);
      setChatBubbleShadow(settings.chatBubbleShadow);
      setTimeBold(settings.timeBold);
    };

    if (nicknameChanged) {
      setUsername(username);
      setNicknameChanged(false);
    } else if (user) {
      setUsername(user.name);
    }

    loadStyleSettings();
  }, [user, setUsername, nicknameChanged, setNicknameChanged, username]);

  useEffect(() => {
    if (isLoggedIn) {
      const initialSidebarState = loadSidebarState();
      setIsSidebarOpen(initialSidebarState);
    }
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = async () => {
    navigate("/mypage");
  };

  const handleLogoutClick = async () => {
    try {
      const logoutSuccess = await logout();
      if (logoutSuccess) {
        setIsLoggedIn(false);
        setIsSidebarOpen(false);
        navigate('/chat');
      } else {
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChatInputAttempt = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  };

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    updateConversations();
  }, []);

  const handleUpdateMessage = useCallback((aiMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    updateConversations();
  }, []);

  const handleConversationSelect = async (conversationId: string) => {
    try {
      await loadMessages(conversationId);
      setSelectedConversationId(conversationId);
      setIsNewChat(false);
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const updateConversations = async () => {
    try {
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations as Conversation[]);
    } catch (error) {
      console.error('Failed to update conversations:', error);
    }
  };

  const validateLayout = (layout: LayoutItem[]): LayoutItem[] => {
    const occupiedPositions = new Set<string>();
    return layout.map(item => {
      let { x, y, w, h } = item;
      if (y < 0) y = 0;
      if (y + h > maxYHSum) y = 0;
      while (isPositionOccupied(x, y, w, h, occupiedPositions)) {
        x = (x + 1) % 12;
        if (x === 0) {
          y = (y + 1) % maxYHSum;
        }
        if (y + h > maxYHSum) {
          y = 0;
        }
      }
      markPosition(x, y, w, h, occupiedPositions);
      return { ...item, x, y, w, h };
    });
  };
  
  const isPositionOccupied = (x: number, y: number, w: number, h: number, occupiedPositions: Set<string>): boolean => {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (occupiedPositions.has(`${x + i},${y + j}`)) {
          return true;
        }
      }
    }
    return false;
  };
  
  const markPosition = (x: number, y: number, w: number, h: number, occupiedPositions: Set<string>): void => {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        occupiedPositions.add(`${x + i},${y + j}`);
      }
    }
  };
  
  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    const validatedLayout = validateLayout(newLayout);
    setCurrentLayout(validatedLayout);
  };
  
  const handleResizeStop = (layout: LayoutItem[]) => {
    const validatedLayout = validateLayout(layout);
    setCurrentLayout(validatedLayout);
  };
  
  const handleDragStop = (layout: LayoutItem[]) => {
    const validatedLayout = validateLayout(layout);
    setCurrentLayout(validatedLayout);
  };
  
  const handleResetLayout = async () => {
    try {
      await resetChatbox();
      setCurrentLayout(INITIAL_LAYOUT);
      originalLayoutRef.current = INITIAL_LAYOUT;
    } catch (error) {
      console.error('Failed to reset chatbox layout:', error);
    }
  };
  
  const handleSaveLayout = async () => {
    try {
      const chatbox = {
        cbox_x: currentLayout[0].x,
        cbox_y: currentLayout[0].y,
        cbox_w: currentLayout[0].w,
        cbox_h: currentLayout[0].h,
      };
      await saveChatbox(chatbox);
      originalLayoutRef.current = currentLayout;
      toggleLayoutEditing();
      setIsSidebarOpen(previousSidebarState);
    } catch (error) {
      console.error('Failed to save chatbox layout:', error);
    }
  };
  
  const handleCancelLayout = () => {
    setCurrentLayout(originalLayoutRef.current);
    toggleLayoutEditing();
    setIsSidebarOpen(previousSidebarState);
  };
  
  const handleSettingsClick = () => {
    setPreviousSidebarState(isSidebarOpen);
    setIsSidebarOpen(false);
    toggleLayoutEditing();
  };
  
  const handleColorClick = () => {
    setPreviousSidebarState(isSidebarOpen);
    setIsSidebarOpen(false);
    setIsColorPickerPanelOpen(true);
  };
  
  const handleClosePanel = () => {
    setIsColorPickerPanelOpen(false);
    setIsSidebarOpen(previousSidebarState);
  };
  
  const handleNewConversation = async (newConversationId: string) => {
    setSelectedConversationId(newConversationId);
    setIsNewChat(false);
    navigate(`/chat/${newConversationId}`);
  };
  
  const handleConversationDelete = async (resetChat: boolean = false) => {
    try {
      const updatedConversations = await fetchConversations();
      setConversations(updatedConversations);
      if (resetChat) {
        setSelectedConversationId(null);
        setIsNewChat(true);
        navigate('/chat');
      }
    } catch (error) {
      console.error('Failed to update conversations list:', error);
    }
  };
  
  const handleStartConversation = async () => {
    if (sidebarRef.current) { 
      sidebarRef.current.startConversation();
    } 
  };
  
  const toggleLayoutEditing = () => {
    setIsLayoutEditing(prev => !prev);
  };

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    saveSidebarState(newState);
  };

  useEffect(() => {
    const loadChatboxLayout = async () => {
      try {
        const fetchedChatbox = await getChatboxes();

        if (fetchedChatbox) {
          const validatedChatbox = [{
            i: 'chatContainer',
            x: Number(fetchedChatbox.cbox_x),
            y: Number(fetchedChatbox.cbox_y),
            w: Number(fetchedChatbox.cbox_w),
            h: Number(fetchedChatbox.cbox_h),
            minH: 4,
            minW: 3,
            maxW: 12,
            maxH: 9
          }];
          setCurrentLayout(validatedChatbox);
          originalLayoutRef.current = validatedChatbox;
        } else {
          setCurrentLayout(INITIAL_LAYOUT);
          originalLayoutRef.current = INITIAL_LAYOUT;
        }
      } catch (error) {
        console.error('Failed to fetch chatbox layout:', error);
        setCurrentLayout(INITIAL_LAYOUT);
        originalLayoutRef.current = INITIAL_LAYOUT;
      }
    };

    if (isLoggedIn) {
      loadChatboxLayout();
    }
  }, [isLoggedIn]);

  return (
    <main className={`main-section`}>
      <div className={`header-container ${isSidebarOpen ? 'shifted-header' : ''}`}>
        {isLoggedIn && (
          <button className="toggle-sidebar-button" onClick={toggleSidebar}>
            <TbLayoutSidebar size={35}/>
          </button>
        )}
        <span className="home_new_conversation" onClick={handleStartConversation}> <LuPenSquare /> </span>
        <span className="brand-text" onClick={() => navigate('/chat')}>BranchGPT</span>
      </div>
      {isLoggedIn ? (
        <>
          <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
          <Sidebar
            ref={sidebarRef}
            isOpen={isSidebarOpen}
            conversations={conversations}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            onConversationDelete={handleConversationDelete}
            onModelSelect={handleModelSelect}
          />
          {isLayoutEditing ? (
            <div className="settings-container">
              <button className="save-button" onClick={handleSaveLayout}>저장</button>
              <button className="cancel-button" onClick={handleCancelLayout}>취소</button>
              <button className="reset-button" onClick={handleResetLayout}>초기화</button>
            </div>
          ) : (
            <div className="settings-container">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic" className="FaCog-dropdown-toggle">
                  <div className="home-set-icon">
                    {username.charAt(0)}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleProfileClick}> <FontAwesomeIcon icon={faUser} /> 프로필</Dropdown.Item>
                  <Dropdown.Item onClick={handleSettingsClick}><FontAwesomeIcon icon={faSquareMinus} /> Chatbox 변경</Dropdown.Item>
                  <Dropdown.Item onClick={handleColorClick}><FontAwesomeIcon icon={faPalette} /> 스타일 변경</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogoutClick}><FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          {isColorPickerPanelOpen && (
            <ColorPickerPanel
              myChatBubbleColor={myChatBubbleColor}
              setMyChatBubbleColor={setMyChatBubbleColor}
              myChatTextColor={myChatTextColor}
              setMyChatTextColor={setMyChatTextColor}
              otherChatBubbleColor={otherChatBubbleColor}
              setOtherChatBubbleColor={setOtherChatBubbleColor}
              otherChatTextColor={otherChatTextColor}
              setOtherChatTextColor={setOtherChatTextColor}
              chatBubbleBold={chatBubbleBold}
              setChatBubbleBold={setChatBubbleBold}
              chatBubbleShadow={chatBubbleShadow}
              setChatBubbleShadow={setChatBubbleShadow}
              chatContainerBgColor={chatContainerBgColor}
              setChatContainerBgColor={setChatContainerBgColor}
              showTime={showTime}
              setShowTime={setShowTime}
              timeBold={timeBold}
              setTimeBold={setTimeBold}
              closePanel={handleClosePanel}
            />
          )}
        </>
      ) : (
        <div className="login-container">
          <button className="login-button" onClick={handleLoginClick}>로그인</button>
        </div>
      )}
      <div className={`main-content ${isSidebarOpen ? 'shifted-right' : ''}`}>
        <div className="grid-container">
          <GridLayout
            className="layout"
            layout={currentLayout}
            cols={12}
            rowHeight={(viewportHeight - 56) / 9}
            width={viewportWidth}
            isResizable={isLayoutEditing}
            isDraggable={isLayoutEditing}
            onLayoutChange={handleLayoutChange}
            onResizeStop={handleResizeStop}
            onDragStop={handleDragStop}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            compactType={null}
            preventCollision={true} 
          >
            <div
              key="chatContainer"
              className={`grid-item chat-container ${isLayoutEditing ? 'edit-mode' : ''} ${!isLayoutEditing ? 'no-border' : ''}`}
              data-grid={{ ...currentLayout.find(item => item.i === 'chatContainer'), resizeHandles: isLayoutEditing ? ['s', 'e', 'w', 'n'] : [] }}
            >
              <div className="chat-list-container" style={{ flexGrow: 1 }}>
                {isNewChat ? (
                  <div className="alert alert-info text-center">
                    새로운 대화를 시작해 보세요!
                  </div>
                ) : (
                  <ChatList
                    messages={messages}
                    username={username}
                    showTime={true}
                  />
                )}
              </div>
              <div className="chat-box-container">
                <ChatBox
                  onNewMessage={handleNewMessage}
                  onUpdateMessage={handleUpdateMessage}
                  conversationId={selectedConversationId}
                  isNewChat={isNewChat}
                  onChatInputAttempt={handleChatInputAttempt}
                  isLoggedIn={isLoggedIn}
                  selectedModel={selectedModel}
                  onNewConversation={handleNewConversation}
                  isEditMode={isLayoutEditing}  // 추가
                  setSelectedConversationId={setSelectedConversationId}  // 추가
                />
              </div>
            </div>
          </GridLayout>
        </div>
      </div>
      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        handleLogin={handleLoginClick}
      />
    </main>
  );
  };
  
  export default Home;
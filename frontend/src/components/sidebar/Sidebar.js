import React, { useEffect, useRef } from 'react';
import { FaBars, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { deleteConversation, deleteAllChats } from '../../api/axiosInstance'; // 삭제 API 함수 임포트
import '../../css/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, isLoggedIn, closeSidebar, conversations, onConversationSelect, onNewChat, onConversationDelete }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });
  const sidebarRef = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  const groupByDate = (rooms) => {
    return rooms.reduce((groups, room) => {
      const date = room.createdAt.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(room);
      return groups;
    }, {});
  };

  const sortedChatRooms = () => {
    const grouped = groupByDate(conversations);
    return Object.keys(grouped)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => ({
        date,
        rooms: grouped[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }));
  };

  const handleRoomClick = (roomId) => {
    onConversationSelect(roomId);
    navigate(`/chat/${roomId}`);
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleDeleteClick = async (roomId) => {
    try {
      await deleteConversation(roomId);
      onConversationDelete(); // 삭제 후 상태 업데이트 호출
      closeSidebar();
      alert('대화가 성공적으로 삭제되었습니다.');
    } catch (error) {
      alert('대화 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteAllChats = async () => {
    try {
      await deleteAllChats();
      alert('대화기록이 성공적으로 삭제되었습니다.');
      onConversationDelete(); // 삭제 후 상태 업데이트 호출
      closeSidebar();
    } catch (error) {
      alert('대화기록 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  // 사이드바 순서를 콘솔에 출력
  useEffect(() => {
    sortedChatRooms().forEach(group => {
      group.rooms.forEach(room => {
        console.log(`대화 ID: ${room._id}, 마지막 메시지: ${room.chats[room.chats.length - 1]?.content}`);
      });
    });
  }, [conversations]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`} ref={sidebarRef}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <div className="sidebar-menu">
        {conversations.length > 0 && (
          <button className="delete-all-button" onClick={handleDeleteAllChats}>
            <FaTrashAlt size={16} /> 모든 채팅 기록 삭제
          </button>
        )}
        {conversations.length === 0 ? (
          <div className="no-chat-rooms">
            <p>대화 기록이 없습니다.<br /> 새로운 채팅을 시작해 보세요!</p>
          </div>
        ) : (
          sortedChatRooms().map((group, index) => (
            <div key={index} className="chat-date-group">
              <h3 className="chat-date">{formatDate(group.date)}</h3>
              {group.rooms.map((room, idx) => (
                <div key={idx} className="chat-room">
                  <p className="last-message" onClick={() => handleRoomClick(room._id)}>
                    {room.chats[room.chats.length - 1]?.content}
                  </p>
                  <button className="delete-button" onClick={() => handleDeleteClick(room._id)}>
                    <FaTrashAlt size={16} />
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;

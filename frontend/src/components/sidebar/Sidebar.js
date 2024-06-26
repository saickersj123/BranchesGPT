import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { fetchChatHistory } from '../../api/axiosInstance';
import { useMediaQuery } from 'react-responsive';
import '../../css/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, isLoggedIn, closeSidebar }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });

  useEffect(() => {
    const getChatRooms = async () => {
      try {
        const rooms = await fetchChatHistory();
        setChatRooms(rooms);
      } catch (error) {
        console.error('채팅방 목록을 가져오는 데 실패했습니다:', error);
      }
    };

    if (isLoggedIn) {
      getChatRooms();
    }
  }, [isLoggedIn]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  const groupByDate = (rooms) => {
    return rooms.reduce((groups, room) => {
      const date = room.time.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(room);
      return groups;
    }, {});
  };

  const sortedChatRooms = () => {
    const grouped = groupByDate(chatRooms);
    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(date => ({
        date,
        rooms: grouped[date]
      }));
  };

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`);
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <div className="sidebar-menu">
        {chatRooms.length === 0 ? (
          <div className="no-chat-rooms">
            <p>대화 기록이 없습니다.<br /> 새로운 채팅을 시작해 보세요!</p>
          </div>
        ) : (
          sortedChatRooms().map((group, index) => (
            <div key={index} className="chat-date-group">
              <h3 className="chat-date">{formatDate(group.date)}</h3>
              {group.rooms.map((room, idx) => (
                <div key={idx} className="chat-room" onClick={() => handleRoomClick(room.roomId)}>
                  <p className="last-message">{room.lastMessage}</p>
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

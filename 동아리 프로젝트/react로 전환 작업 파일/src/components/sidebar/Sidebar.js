import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../../css/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, isLoggedIn }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      {isOpen && (
        <div className="sidebar-menu"> 
          <p> 과거의 채팅기록이 위치하게 될 공간입니다.</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

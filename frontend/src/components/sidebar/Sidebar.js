// src/components/sidebar/Sidebar.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTrashAlt, FaPlus, FaRobot, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { deleteConversation, deleteAllChats, startNewConversation, sendMessage } from '../../api/axiosInstance';
import '../../css/Sidebar.css';

const Sidebar = ({  isOpen, 
                    toggleSidebar, 
                    closeSidebar, 
                    conversations, 
                    onConversationDelete, 
                    onNewModel,
                    setIsNewChat,
                    handleUpdateMessage,
                    setSelectedConversationId, }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);
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

  const handleDeleteClick = (roomId) => {
    setDeleteRoomId(roomId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteConversation(deleteRoomId);
      onConversationDelete();
      setShowDeleteModal(false);
      alert('대화가 성공적으로 삭제되었습니다.');
    } catch (error) {
      alert('대화 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteAllChats = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAllChats = async () => {
    try {
      await deleteAllChats();
      alert('대화기록이 성공적으로 삭제되었습니다.');
      onConversationDelete();
      setShowDeleteAllModal(false);
    } catch (error) {
      alert('대화기록 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };


  const sortedChatRooms = useCallback(() => {
    const grouped = groupByDate(conversations);
    return Object.keys(grouped)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => ({
        date,
        rooms: grouped[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }));
  }, [conversations]);

  const truncateMessage = (message, length) => {
    if (message.length <= length) return message;
    return message.substring(0, length) + '...';
  };

  const onNewConversation = async (messageContent, role = 'user') => {
    try {
        const newConversationResponse = await startNewConversation(messageContent, role);
        let newConversationId = newConversationResponse.conversations[newConversationResponse.conversations.length - 1]._id;
      
        if (!newConversationId) {
        console.warn('No new conversation started.');
        return;
      }

      const response = await sendMessage(newConversationId, messageContent);

      if (response && response.length > 0) {
        const aiMessage = {
          content: response[response.length - 1].content,
          role: 'assistant',
          createdAt: new Date().toISOString()
        };
        handleUpdateMessage(aiMessage);
      }

      setSelectedConversationId(newConversationId);
      navigate(`/chat/${newConversationId}`);
      setIsNewChat(false);
      return newConversationId;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized (401):', error.response.data);
      } else {
        console.error('새로운 대화 시작 실패:', error);
      }
    }
  };
  useEffect(() => {
    sortedChatRooms().forEach(group => {
      group.rooms.forEach(room => {
        console.log(`대화 ID: ${room._id}, 마지막 메시지: ${room.chats[room.chats.length - 1]?.content}`);
      });
    });
  }, [conversations, sortedChatRooms]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`} ref={sidebarRef}>
      <div className="sidebar-header">
        <button className="new-conversation-button" onClick={onNewConversation}>
          <FaPlus size={20} />
        </button>
        <button className="new-model-button" onClick={onNewModel}>
          <FaRobot size={25} />
        </button>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-menu">
          {conversations.length === 0 ? (
            <div className="no-chat-rooms">
              <p>대화가 없습니다.</p>
            </div>
          ) : (
            sortedChatRooms().map((group, index) => (
              <div key={index} className="chat-date-group">
                <h3 className="chat-date">{formatDate(group.date)}</h3>
                {group.rooms.map((room, idx) => (
                  <div key={idx} className="chat-room">
                    <span className="room-title">
                      {room.chats.length > 0 ? truncateMessage(room.chats[room.chats.length - 1].content, 40) : "No messages yet"}
                    </span>
                    <button className="delete-button" onClick={() => handleDeleteClick(room._id)}>
                      <FaMinus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
        {conversations.length > 0 && (
          <button className="delete-all-button" onClick={handleDeleteAllChats}>
            <FaTrashAlt size={16} /> 
          </button>
        )}
      </div>
    {/* Modal for single conversation delete */}
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 이 대화를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for deleting all conversations */}
      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>모든 대화 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 모든 대화를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={confirmDeleteAllChats}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;

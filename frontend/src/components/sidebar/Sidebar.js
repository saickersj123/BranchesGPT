import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTrashAlt, FaPlus, FaRobot, FaMinus, FaList } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import { deleteConversation, deleteAllChats, startNewConversation, getCustomModels, createModel, deleteModel } from '../../api/axiosInstance';
import '../../css/Sidebar.css';

const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  closeSidebar, 
  conversations, 
  onConversationDelete,
  onNewModel, 
  onNewConversation, 
  onConversationSelect,
  onModelConversationSelect,
  onModelSelect // New prop to handle model selection
}) => {
  const sidebarRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showDeleteModelModal, setShowDeleteModelModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [deleteModelId, setDeleteModelId] = useState(null);
  const [, setError] = useState('');
  const [models, setModels] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [modelName, setModelName] = useState('');
  const [systemContent, setSystemContent] = useState('');
  const [userAssistantPairs, setUserAssistantPairs] = useState([{ user: '', assistant: '' }]);

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
      onConversationDelete(true);
      setShowDeleteModal(false);
      console.log('대화가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.log('대화 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteAllChats = () => {
    setShowDeleteAllModal(true);
  };

  const confirmDeleteAllChats = async () => {
    try {
      await deleteAllChats();
      console.log('대화기록이 성공적으로 삭제되었습니다.');
      onConversationDelete(true);
      setShowDeleteAllModal(false);
    } catch (error) {
      console.log('대화기록 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const sortedChatRooms = useCallback(() => {
    const grouped = groupByDate(conversations);
    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(date => ({
        date,
        rooms: grouped[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }));
  }, [conversations]);

  const truncateMessage = (message, length) => {
    if (message.length <= length) return message;
    return message.substring(0, length) + '...';
  };

  useEffect(() => {
    sortedChatRooms().forEach(group => {
      group.rooms.forEach(room => {
        console.log(`대화 ID: ${room._id}, 마지막 메시지: ${room.chats[room.chats.length - 1]?.content}`);
      });
    });
  }, [conversations, sortedChatRooms]);

  const startConversation = async () => {
    try {
      const newConversationResponse = await startNewConversation();
      const newConversationId = newConversationResponse;

      if (newConversationId) {
        onNewConversation(newConversationId);
      } else {
        console.warn('No new conversation started.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.cause || 'The last conversation is still empty. Please add messages before creating a new conversation.');
      } else if (error.response && error.response.status === 401) {
        console.error('Unauthorized (401):', error.response.data);
      } else {
        console.error('Failed to start new conversation:', error);
      }
      setShowErrorModal(true);
    }
  };

  const handleModelClick = async () => {
    try {
      const fetchedModels = await getCustomModels();
      setModels(fetchedModels);
      setShowModelModal(true);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      setError('Failed to fetch models.');
      setShowErrorModal(true);
    }
  };



  const handleModelSelect = (modelId) => {
    onModelSelect(modelId); // Pass the selected model ID to the parent component
    setShowModelModal(false);
  };

  const handleTrainModelClick = () => {
    setShowTrainingModal(true);
    setShowModelModal(false);
  };

  const handleAddPair = () => {
    setUserAssistantPairs([...userAssistantPairs, { user: '', assistant: '' }]);
  };

  const handleRemovePair = (index) => {
    setUserAssistantPairs(userAssistantPairs.filter((_, i) => i !== index));
  };

  const handlePairChange = (index, role, value) => {
    const newPairs = [...userAssistantPairs];
    newPairs[index][role] = value;
    setUserAssistantPairs(newPairs);
  };

  const handleSubmit = async () => {
    setIsTraining(true);
    setResponseMessage('');
    try {
      // Convert each pair to a JSON string and join with newline
      const trainingData = userAssistantPairs.map(pair => JSON.stringify({
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: pair.user },
          { role: "assistant", content: pair.assistant }
        ]
      })).join('\n');

      console.log("Submitting model with the following data:");
      console.log("Model Name: ", modelName);
      console.log("Training Data: ", trainingData);

      // Ensure that createModel sends the trainingData as a string, not as a JSON array
      await createModel(modelName, trainingData); // Send as JSONL string
      setResponseMessage('Model created successfully');
      const updatedModels = await getCustomModels();
      setModels(updatedModels);
      await handleBacktoModels();
    } catch (error) {
      setResponseMessage(`Error creating model: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  const handleCloseTrainingModal = () => {
    setShowTrainingModal(false);
    setModelName('');
    setSystemContent('');
    setUserAssistantPairs([{ user: '', assistant: '' }]);
    setResponseMessage('');
  };

  const handleBacktoModels = async () => {
    setShowTrainingModal(false);
    setModelName('');
    setSystemContent('');
    setUserAssistantPairs([{ user: '', assistant: '' }]);
    setResponseMessage('');
    const updatedModels = await getCustomModels();
    setModels(updatedModels);
    setShowModelModal(true);
  };

  const handleDeleteModelClick = (modelId) => {
    setDeleteModelId(modelId);
    setShowDeleteModelModal(true);
    setShowModelModal(false);
  };

  const confirmDeleteModel = async () => {
    try {
      await deleteModel(deleteModelId);
      setShowDeleteModelModal(false);
      console.log('모델이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.log('모델 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const cancelDeleteModel = () => {
    setShowDeleteModelModal(false);
    setShowModelModal(true);
  }; 

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`} ref={sidebarRef}>
      <div className="sidebar-header">
        <button className="new-conversation-button" onClick={startConversation}>
          <FaPlus size={20} />
        </button>
        <button className="new-model-button" onClick={handleModelClick}>
          <FaRobot size={25} />
        </button>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-menu">
          {conversations.length === 0 ? (
            <div className="no-chat-rooms">
              <p>대화 내역이 이곳에 저장됩니다.</p>
            </div>
          ) : (
            sortedChatRooms().map((group, index) => (
              <div key={index} className="chat-date-group">
                <h3 className="chat-date">{formatDate(group.date)}</h3>
                {group.rooms.map((room, idx) => (
                  <div 
                    key={idx} 
                    className="chat-room"
                    onClick={() => onConversationSelect(room._id)}
                  >
                    <span className="room-title">
                      {room.chats.length > 0 ? truncateMessage(room.chats[room.chats.length - 1].content, 40) : "새 대화를 시작하세요."}
                    </span>
                    <button className="delete-button" onClick={(e) => {e.stopPropagation(); handleDeleteClick(room._id); }}>
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
          <Modal.Title>대화 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 대화를 삭제하시겠습니까?</Modal.Body>
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
      {/* Modal for displaying errors */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>오류</Modal.Title>
        </Modal.Header>
        <Modal.Body>{'이미 새 대화가 생성되었습니다.'}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for displaying models */}
      <Modal show={showModelModal} onHide={() => setShowModelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>모델 목록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="model-list">
            {models.map((model, index) => (
              <div key={index} className="model-item">
                <div className="model-item-content" onClick={() => handleModelSelect(model.modelId)}>
                  <div className="model-name">{model.modelName}</div>
                  <div className="model-date">{formatDate(model.createdAt)}</div>
                  <div className="model-id">{model.modelId}</div>
                </div>
                <button className="delete-button" onClick={() => handleDeleteModelClick(model.modelId)}>
                  <FaMinus size={16} />
                </button>
              </div>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTrainModelClick}>
            <FaPlus size={25} />
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for training a new model */}
      <Modal show={showTrainingModal} onHide={handleCloseTrainingModal}>
        <Modal.Header closeButton>
          <Modal.Title>모델 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group">
            <label>모델 이름</label>
            <input
              type="text"
              placeholder="모델 이름을 입력하세요"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>모델 역할</label>
            <textarea
              rows={3}
              placeholder="모델의 성격, 임무, 역할 등을 알려주세요."
              value={systemContent}
              onChange={(e) => setSystemContent(e.target.value)}
              required
            />
          </div>
          {userAssistantPairs.map((pair, index) => (
            <div key={index} className="input-group-pair">
              <div className="input-group-pair-header">
                <label>예시 질문 {index + 1}</label>
                {index > 0 && (
                  <Button variant="danger" onClick={() => handleRemovePair(index)}>
                    <FaMinus size={15}/>
                  </Button>
                )}
              </div>
              <div className="input-group">
                <textarea
                  rows={2}
                  placeholder="예시 질문을 입력하세요."
                  value={pair.user}
                  onChange={(e) => handlePairChange(index, 'user', e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>원하는 응답 {index + 1}</label>
                <textarea
                  rows={2}
                  placeholder="원하는 응답 또는 대답을 알려주세요."
                  value={pair.assistant}
                  onChange={(e) => handlePairChange(index, 'assistant', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          {responseMessage && <p>{responseMessage}</p>}
          <Button variant="light" onClick={handleBacktoModels}>
            <FaList size={20} />
          </Button>
          <Button variant="light" onClick={handleAddPair}>
            <FaPlus size={20} />
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isTraining}>
            {isTraining ? '학습 중...' : '모델 생성'}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal for single model delete */}
      <Modal show={showDeleteModelModal} onHide={() => setShowDeleteModelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 모델을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteModel}>
            취소
          </Button>
          <Button variant="danger" onClick={confirmDeleteModel}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;
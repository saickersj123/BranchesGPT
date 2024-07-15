// Pretrain.js

import React, { useState, useEffect } from 'react';
import { createCustomModel, getAllCustomModels, deleteCustomModel, startNewModelConversation, resumeConversation } from '../api/axiosInstance';
import { Container, Row, Col, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Pretrain.css';

const Pretrain = () => {
  const [modelName, setModelName] = useState('');
  const [systemContent, setSystemContent] = useState('You are a happy assistant that puts a positive spin on everything.');
  const [userContent, setUserContent] = useState('');
  const [assistantContent, setAssistantContent] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [customModels, setCustomModels] = useState([]);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConversationActive, setIsConversationActive] = useState(false); // 새로운 상태 추가

  useEffect(() => {
    const fetchCustomModels = async () => {
      try {
        const models = await getAllCustomModels();
        setCustomModels(models);
      } catch (err) {
        setError(err.response ? err.response.data.cause : err.message);
      }
    };

    fetchCustomModels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsTraining(true);
    setResponseMessage('');

    try {
      const trainingData = JSON.stringify([
        { role: "system", content: systemContent },
        { role: "user", content: userContent },
        { role: "assistant", content: assistantContent }
      ]);

      console.log("Submitting model with the following data:");
      console.log("Model Name: ", modelName);
      console.log("Training Data: ", trainingData);

      const response = await createCustomModel(modelName, trainingData);
      setResponseMessage('Model created successfully');
      const updatedModels = await getAllCustomModels();
      setCustomModels(updatedModels);
    } catch (error) {
      setResponseMessage(`Error creating model: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  const handleDelete = async (modelId) => {
    try {
      console.log(`Deleting model with ID: ${modelId}`);
      await deleteCustomModel(modelId);
      const updatedModels = await getAllCustomModels();
      setCustomModels(updatedModels);
    } catch (error) {
      console.error(`Failed to delete model: ${error.message}`);
      setError(error.response ? error.response.data.cause : error.message);
    }
  };

  const handleStartConversation = (modelName) => {
    setModelName(modelName);
    setIsConversationActive(true); // 새 메시지 공간 활성화
  };

  const handleSendMessage = async (modelName, message) => {
    try {
      console.log(`Starting new conversation with model: ${modelName} and message: ${message}`);
      const response = await startNewModelConversation(modelName, message); // 새 메시지로 대화 시작
      const newConversationId = response.conversations[response.conversations.length - 1]._id;
      console.log(`New conversation started with ID: ${newConversationId}`);
      setConversationId(newConversationId);
      setMessages(response.conversations[response.conversations.length - 1].chats);
      setIsConversationActive(false); // 새 메시지 공간 비활성화
      setNewMessage('');
      setResponseMessage(`Conversation started with ID: ${newConversationId}`);
    } catch (error) {
      console.error(`Error starting conversation: ${error.message}`);
      setError(error.response ? error.response.data.cause : error.message);
    }
  };

  const handleResumeConversation = async (modelName, message) => {
    try {
      console.log(`Resuming conversation with model: ${modelName} and message: ${message}`);
      const response = await resumeConversation(modelName, conversationId, message);
      console.log('Received response:', response);
      setMessages(response.chats);
      setNewMessage('');
    } catch (error) {
      console.error(`Error resuming conversation: ${error.message}`);
      setError(error.response ? error.response.data.cause : error.message);
    }
  };

  return (
    <Container fluid className="pretrain-container">
      <Row>
        <Col md={4} className="model-list">
          <h1>사용자 정의 모델 목록</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <ListGroup>
            {customModels.map((model) => (
              <ListGroup.Item key={model._id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Model Name:</strong> {model.modelName} <br />
                  <strong>Model ID:</strong> {model.modelId} <br />
                  <strong>Created At:</strong> {new Date(model.createdAt).toLocaleString()}
                </div>
                <Button variant="danger" onClick={() => handleDelete(model.modelId)}>삭제</Button>
                <Button variant="primary" onClick={() => handleStartConversation(model.modelName)}>대화 시작</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8} className="model-training">
          <h1>사전학습</h1>
          <Form onSubmit={handleSubmit} className="pretrain-form">
            <Form.Group controlId="modelName">
              <Form.Label>모델 이름:</Form.Label>
              <Form.Control
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="systemContent">
              <Form.Label>시스템:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={systemContent}
                onChange={(e) => setSystemContent(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="userContent">
              <Form.Label>사용자:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={userContent}
                onChange={(e) => setUserContent(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="assistantContent">
              <Form.Label>어시스턴트:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={assistantContent}
                onChange={(e) => setAssistantContent(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isTraining}>
              {isTraining ? '학습 중...' : '모델 생성'}
            </Button>
            {responseMessage && <Alert variant="info" className="response-message">{responseMessage}</Alert>}
          </Form>

          <h2>대화</h2>
          {conversationId && (
            <Alert variant="info">
              <strong>대화 ID:</strong> {conversationId}
            </Alert>
          )}
          <ListGroup className="mb-3">
            {messages.map((msg, index) => (
              <ListGroup.Item key={index}>
                <strong>{msg.role}:</strong> {msg.content}
              </ListGroup.Item>
            ))}
          </ListGroup>
          {isConversationActive && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(modelName, newMessage);
              }}
            >
              <Form.Group controlId="newMessage">
                <Form.Label>새 메시지:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                전송
              </Button>
            </Form>
          )}
          {!isConversationActive && conversationId && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleResumeConversation(modelName, newMessage);
              }}
            >
              <Form.Group controlId="newMessage">
                <Form.Label>새 메시지:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  required
                  disabled={!conversationId}
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={!conversationId}>
                전송
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Pretrain;
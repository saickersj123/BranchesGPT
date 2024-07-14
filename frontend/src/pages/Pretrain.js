import React, { useState } from 'react';
import { createCustomModel } from '../api/axiosInstance';
import '../css/Pretrain.css';

const Pretrain = () => {
  const [modelName, setModelName] = useState('');
  const [systemContent, setSystemContent] = useState('You are a happy assistant that puts a positive spin on everything.');
  const [userContent, setUserContent] = useState('');
  const [assistantContent, setAssistantContent] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

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
    } catch (error) {
      setResponseMessage(`Error creating model: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="pretrain-container">
      <h1>사전학습</h1>
      <form onSubmit={handleSubmit} className="pretrain-form">
        <div className="form-group">
          <label htmlFor="modelName">모델 이름:</label>
          <input
            type="text"
            id="modelName"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="systemContent">시스템:</label>
          <textarea
            id="systemContent"
            value={systemContent}
            onChange={(e) => setSystemContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="userContent">사용자:</label>
          <textarea
            id="userContent"
            value={userContent}
            onChange={(e) => setUserContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="assistantContent">어시스턴트:</label>
          <textarea
            id="assistantContent"
            value={assistantContent}
            onChange={(e) => setAssistantContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={isTraining} className="pretrain-button">
          {isTraining ? '학습 중...' : '모델 생성'}
        </button>
        {responseMessage && <div className="response-message">{responseMessage}</div>}
      </form>
    </div>
  );
};

export default Pretrain;

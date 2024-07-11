// Pretrain.js

import React, { useState } from 'react';
import { createCustomModel } from '../api/axiosInstance';
import '../css/Pretrain.css';

const Pretrain = () => {
  const [modelName, setModelName] = useState('');
  const [trainingData, setTrainingData] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsTraining(true);
    setResponseMessage('');
    
    try {
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
          <label htmlFor="trainingData">학습 데이터:</label>
          <textarea
            id="trainingData"
            value={trainingData}
            onChange={(e) => setTrainingData(e.target.value)}
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

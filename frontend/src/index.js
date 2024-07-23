import React from 'react';
import { createRoot } from 'react-dom/client';
import './css/Home.css'; // TailwindCSS 설정된 파일
import './css/App.css'; // 필요한 경우 별도의 CSS 파일
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<App tab="home" />);
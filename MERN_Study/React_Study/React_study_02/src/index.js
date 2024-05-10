import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
/* The following line can be included in your src/index.js or App.js file */
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// this is the entry point of the React application. ami jodi npm start kori, tahole ei file ta run hobe
// ekhane ReactDOM er createRoot method diye root element ke target kora hoyeche, jar moddhe App component ke render kora hocche
// React.StrictMode hocche ekta wrapper ja development mode e kichu extra checks and warnings provide kore
// App component hocche main component ja src/App.js file e define kora ache
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
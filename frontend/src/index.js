import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ ADD THESE TWO LINES
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <>
      <App />

      {/* 🔔 ADD THIS */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  </React.StrictMode>
);

reportWebVitals();
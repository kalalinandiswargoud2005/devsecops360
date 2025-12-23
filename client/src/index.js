import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- THE ULTIMATE FIX ---
// This patches the browser's ResizeObserver to prevent the loop error entirely
const originalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends originalResizeObserver {
  constructor(callback) {
    super((entries, observer) => {
      // Defer the callback to the next animation frame
      window.requestAnimationFrame(() => {
        callback(entries, observer);
      });
    });
  }
};
// ------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
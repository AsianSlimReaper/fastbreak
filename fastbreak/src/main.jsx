import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HashRouter } from 'react-router-dom';

// createRoot renders the App component inside the root element
ReactDOM.createRoot(document.getElementById('root')).render(
    <HashRouter>
        <App />
    </HashRouter>
);

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage'; // Sua página de registro
import ScanPage from './pages/ScanPage'; // Sua página de leitura de QR code

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/scan" element={<ScanPage />} />
      </Routes>
    </Router>
  );
}

export default App;

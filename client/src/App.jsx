import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CVProvider } from './context/CVContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateCV from './pages/CreateCV';
import Templates from './pages/Templates';
import './index.css';

function App() {
  return (
    <CVProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateCV />} />
              <Route path="/templates" element={<Templates />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CVProvider>
  );
}

export default App;

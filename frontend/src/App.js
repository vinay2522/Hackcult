import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import AddEvidence from './components/AddEvidence';
import ViewEvidence from './components/ViewEvidence';
import AcessEvidence from './components/AcessEvidence'; // Keep the original name
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEvidence />} />
          <Route path="/view" element={<ViewEvidence />} />
          <Route path="/acess" element={<AcessEvidence />} /> {/* Keep the original route path */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/login';
import Register from './components/register';
import AddEvidence from './components/AddEvidence';
import ViewEvidence from './components/ViewEvidence';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add" element={<AddEvidence />} />
            <Route path="/view" element={<ViewEvidence />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
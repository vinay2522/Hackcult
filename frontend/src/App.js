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
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
          <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/add" 
              element={
                <ProtectedRoute>
                  <AddEvidence />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/view" 
              element={
                <ProtectedRoute>
                  <ViewEvidence />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
        </main>
      </div>
    </Router>
    
  );
}

export default App;
// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import AddEvidence from './components/AddEvidence';
import ViewEvidence from './components/ViewEvidence';
import VerifyEvidence from './components/VerifyEvidence';
import Login from './components/login';
import Register from './components/register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
    return (
      
        <AuthProvider>
            <Router>
            <ToastContainer position="top-right" autoClose={5000} />
                <div className="App">
                    <Navigation />
                    <main className="container">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route 
                                path="/add-evidence" 
                                element={
                                    <ProtectedRoute>
                                        <AddEvidence />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/view-evidence" 
                                element={
                                    <ProtectedRoute>
                                        <ViewEvidence />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                
                                path="/verify-evidence" 
                                element={
                                    <ProtectedRoute>
                                        <VerifyEvidence />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
                
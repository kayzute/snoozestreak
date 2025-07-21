import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LogActivity from './pages/LogActivity.jsx';
import LogHistory from './pages/LogHistory.jsx';
import Settings from './pages/Settings.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Survey from './pages/Survey.jsx';
import './App.css';

// Protected Route component
function ProtectedRoute({ children, isAuthenticated }) {
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Save the attempted location for redirecting after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route 
            path="/signin" 
            element={<SignIn onLogin={() => setIsAuthenticated(true)} />} 
          />
          <Route 
            path="/signup" 
            element={<SignUp onRegister={() => setIsAuthenticated(true)} />} 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/log-activity" 
            element={
              <LogActivity />
            } 
          />
          <Route 
            path="/log-history" 
            element={
              <LogHistory />
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Settings />
            } 
          />
          <Route 
            path="/survey" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Survey />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
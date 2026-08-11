import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import AdminPanel from './components/AdminPanel';
import EditorPanel from './components/EditorPanel';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return (
      <div className="App">
        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'admin':
        return (
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </RoleBasedRoute>
        );
      case 'editor':
        return (
          <RoleBasedRoute allowedRoles={['admin', 'editor']}>
            <EditorPanel />
          </RoleBasedRoute>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <Navbar setCurrentPage={setCurrentPage} />
      <ProtectedRoute>
        {renderPage()}
      </ProtectedRoute>
    </div>
  );
}

export default App;
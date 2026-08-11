import React from 'react';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>🔒 Access Denied</h2>
          <p style={styles.message}>You need to be logged in to view this page.</p>
          <a href="/" style={styles.link}>Go to Login</a>
        </div>
      </div>
    );
  }

  return children;
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: { color: '#dc3545', marginBottom: '15px' },
  message: { color: '#666', marginBottom: '20px' },
  link: {
    display: 'inline-block',
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px'
  }
};

export default ProtectedRoute;
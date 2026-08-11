import React from 'react';
import { useSelector } from 'react-redux';

function RoleBasedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>🔒 Access Denied</h2>
          <p style={styles.message}>Please login to access this page.</p>
          <a href="/" style={styles.link}>Go to Login</a>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(user?.role)) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>⛔ Unauthorized</h2>
          <p style={styles.message}>
            You don't have permission to access this page.
            <br />
            <span style={styles.roleInfo}>Your role: {user?.role || 'Unknown'}</span>
          </p>
          <a href="/dashboard" style={styles.link}>Go to Dashboard</a>
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
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '400px'
  },
  title: { color: '#dc3545', marginBottom: '15px' },
  message: { color: '#666', marginBottom: '20px', lineHeight: '1.6' },
  roleInfo: { 
    display: 'block', 
    marginTop: '10px',
    padding: '8px',
    background: '#f8f9fa',
    borderRadius: '4px',
    color: '#333',
    fontWeight: 'bold'
  },
  link: {
    display: 'inline-block',
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px'
  }
};

export default RoleBasedRoute;
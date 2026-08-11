import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';

function Login({ onSwitchToRegister }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser({ email, password }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              style={styles.input}
              required
            />
          </div>
          {error && <div style={styles.error}>⚠️ {error}</div>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.switchText}>
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} style={styles.switchButton}>
            Register
          </button>
        </p>
        <div style={styles.demoCreds}>
          <p style={styles.demoText}>Demo Credentials:</p>
          <p style={styles.demoText}>Admin: admin@test.com / password123</p>
          <p style={styles.demoText}>Editor: editor@test.com / password123</p>
          <p style={styles.demoText}>Viewer: viewer@test.com / password123</p>
        </div>
      </div>
    </div>
  );
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
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '400px',
    maxWidth: '90%'
  },
  title: { textAlign: 'center', marginBottom: '30px', color: '#333' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  switchText: {
    textAlign: 'center',
    marginTop: '15px',
    color: '#666'
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  demoCreds: {
    marginTop: '20px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px'
  },
  demoText: {
    margin: '5px 0',
    fontSize: '14px',
    color: '#666'
  }
};

export default Login;
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

function Navbar({ setCurrentPage }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: '#dc3545',
      editor: '#28a745',
      viewer: '#17a2b8'
    };
    return {
      background: colors[role] || '#6c757d',
      padding: '2px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      color: 'white'
    };
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <span style={styles.logo}>🔐</span>
          <span style={styles.brandText}>Auth App</span>
        </div>

        <div style={styles.navItems}>
          <button onClick={() => setCurrentPage('dashboard')} style={styles.navBtn}>
            Dashboard
          </button>
          {user?.role === 'admin' && (
            <button onClick={() => setCurrentPage('admin')} style={styles.navBtn}>
              👑 Admin
            </button>
          )}
          {(user?.role === 'admin' || user?.role === 'editor') && (
            <button onClick={() => setCurrentPage('editor')} style={styles.navBtn}>
              ✏️ Editor
            </button>
          )}
          <span style={styles.userInfo}>
            👤 {user?.name}
            <span style={getRoleBadge(user?.role)}> {user?.role}</span>
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: '#2d2d44',
    padding: '15px 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logo: { fontSize: '24px' },
  brandText: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  navItems: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },
  navBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  userInfo: {
    color: 'white',
    padding: '8px 15px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoutBtn: {
    padding: '8px 20px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Navbar;
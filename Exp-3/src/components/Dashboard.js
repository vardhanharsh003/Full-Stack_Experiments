import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/slices/postsSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const getStatusColor = (status) => {
    return status === 'published' ? '#28a745' : '#ffc107';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>👋 Welcome, {user?.name || 'User'}!</h1>
        <p style={styles.subtitle}>Role: <span style={styles.roleBadge}>{user?.role}</span></p>
      </div>

      {loading && <div style={styles.loading}>Loading posts...</div>}
      {error && <div style={styles.error}>⚠️ {error}</div>}

      <div style={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <span style={{ 
                ...styles.statusBadge, 
                background: getStatusColor(post.status) 
              }}>
                {post.status || 'draft'}
              </span>
            </div>
            <p style={styles.postContent}>{post.content}</p>
            <div style={styles.postMeta}>
              <span>✏️ {post.author}</span>
              <span>📅 {formatDate(post.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.tokenInfo}>
        <h3>🔑 Session Info</h3>
        <p style={styles.tokenText}><strong>User:</strong> {user?.name}</p>
        <p style={styles.tokenText}><strong>Role:</strong> {user?.role}</p>
        <p style={styles.tokenText}><strong>Status:</strong> <span style={{ color: '#28a745' }}>✅ Authenticated</span></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '30px'
  },
  subtitle: {
    color: '#666',
    fontSize: '18px'
  },
  roleBadge: {
    background: '#667eea',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  postCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  postTitle: {
    margin: 0,
    color: '#333'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white'
  },
  postContent: {
    color: '#666',
    lineHeight: '1.6'
  },
  postMeta: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
    color: '#999',
    fontSize: '14px'
  },
  tokenInfo: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  },
  tokenText: {
    margin: '5px 0',
    color: '#666'
  }
};

export default Dashboard;
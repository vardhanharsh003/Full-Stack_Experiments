import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { publishExistingPost, deleteExistingPost } from '../store/slices/postsSlice';

function AdminPanel() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts);

  const handlePublish = (id) => {
    if (window.confirm('Publish this post?')) {
      dispatch(publishExistingPost(id));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this post permanently?')) {
      dispatch(deleteExistingPost(id));
    }
  };

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
        <h1>👑 Admin Panel</h1>
        <p style={styles.subtitle}>Welcome, {user?.name}! You have full access to all posts.</p>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>Total Posts</h3>
          <p style={styles.statNumber}>{posts.length}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Published</h3>
          <p style={styles.statNumber}>{posts.filter(p => p.status === 'published').length}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Drafts</h3>
          <p style={styles.statNumber}>{posts.filter(p => p.status === 'draft').length}</p>
        </div>
      </div>

      <div style={styles.grid}>
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
            <div style={styles.postActions}>
              {post.status !== 'published' && (
                <button 
                  onClick={() => handlePublish(post.id)} 
                  style={styles.publishBtn}
                >
                  📤 Publish
                </button>
              )}
              {/* ✅ Admin can DELETE */}
              <button 
                onClick={() => handleDelete(post.id)} 
                style={styles.deleteBtn}
              >
                🗑️ Delete
              </button>
              {post.status === 'published' && (
                <span style={styles.publishedTag}>✅ Published</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.permissions}>
        <h3>🔑 Your Permissions</h3>
        <ul style={styles.permissionList}>
          <li>✅ Manage Users</li>
          <li>✅ View Analytics</li>
          <li>✅ System Settings</li>
          <li>✅ Moderate Content</li>
          <li>✅ Delete Any Post</li>
          <li>✅ Publish Any Post</li>
          <li>✅ Edit All Content</li>
        </ul>
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
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
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
    lineHeight: '1.6',
    marginBottom: '10px'
  },
  postMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#999',
    fontSize: '14px',
    marginBottom: '10px'
  },
  postActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  publishBtn: {
    padding: '6px 16px',
    background: '#ffc107',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  deleteBtn: {
    padding: '6px 16px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  publishedTag: {
    padding: '6px 16px',
    background: '#28a745',
    color: 'white',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  permissions: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  },
  permissionList: {
    listStyle: 'none',
    padding: '0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px'
  }
};

export default AdminPanel;
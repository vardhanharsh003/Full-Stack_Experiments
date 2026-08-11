import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createNewPost, 
  publishExistingPost,
  updateExistingPost,
  fetchPosts 
} from '../store/slices/postsSlice';

function EditorPanel() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, loading } = useSelector((state) => state.posts);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postData, setPostData] = useState({ title: '', content: '' });

  // Filter posts - show only posts created by this editor
  const userPosts = posts.filter(p => p.author === user?.name);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postData.title.trim() || !postData.content.trim()) {
      alert('Please fill all fields');
      return;
    }
    dispatch(createNewPost({
      title: postData.title,
      content: postData.content,
      author: user?.name,
      status: 'draft'
    }));
    setPostData({ title: '', content: '' });
    setShowCreateForm(false);
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    if (!postData.title.trim() || !postData.content.trim()) {
      alert('Please fill all fields');
      return;
    }
    
    dispatch(updateExistingPost({
      id: editingPost.id,
      updateData: {
        title: postData.title,
        content: postData.content
      }
    }));
    
    setEditingPost(null);
    setPostData({ title: '', content: '' });
  };

  const handlePublish = (id) => {
    if (window.confirm('Publish this post?')) {
      dispatch(publishExistingPost(id));
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setPostData({ title: post.title, content: post.content });
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
        <h1>✏️ Editor Panel</h1>
        <p style={styles.subtitle}>Welcome, {user?.name}! You can create and update posts.</p>
        <button 
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingPost(null);
            setPostData({ title: '', content: '' });
          }} 
          style={styles.createBtn}
        >
          {showCreateForm ? '❌ Cancel' : '📝 Create New Post'}
        </button>
      </div>

      {/* Create New Post Form */}
      {showCreateForm && (
        <div style={styles.formContainer}>
          <h3>Create New Post</h3>
          <form onSubmit={handleCreatePost}>
            <div style={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                value={postData.title}
                onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                placeholder="Enter post title"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Content</label>
              <textarea
                value={postData.content}
                onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                placeholder="Write your post content..."
                rows="4"
                style={styles.textarea}
                required
              />
            </div>
            <button type="submit" style={styles.submitBtn}>Save as Draft</button>
          </form>
        </div>
      )}

      {/* Edit Post Form */}
      {editingPost && (
        <div style={styles.formContainer}>
          <h3>✏️ Edit Post</h3>
          <form onSubmit={handleUpdatePost}>
            <div style={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                value={postData.title}
                onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                placeholder="Enter post title"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Content</label>
              <textarea
                value={postData.content}
                onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                placeholder="Write your post content..."
                rows="4"
                style={styles.textarea}
                required
              />
            </div>
            <div style={styles.editActions}>
              <button type="submit" style={styles.updateBtn}>Update Post</button>
              <button 
                type="button" 
                onClick={() => {
                  setEditingPost(null);
                  setPostData({ title: '', content: '' });
                }} 
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div style={styles.loading}>Loading posts...</div>}

      {/* Posts List */}
      <div style={styles.postsGrid}>
        {userPosts.length === 0 ? (
          <p style={styles.empty}>No posts found. Create your first post!</p>
        ) : (
          userPosts.map((post) => (
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
                {/* Edit Button - Editor can edit */}
                <button 
                  onClick={() => handleEdit(post)} 
                  style={styles.editBtn}
                >
                  ✏️ Edit
                </button>
                
                {/* Publish Button - Editor can publish */}
                {post.status !== 'published' && (
                  <button 
                    onClick={() => handlePublish(post.id)} 
                    style={styles.publishBtn}
                  >
                    📤 Publish
                  </button>
                )}
                
                {post.status === 'published' && (
                  <span style={styles.publishedTag}>✅ Published</span>
                )}

                {/* ❌ NO DELETE BUTTON FOR EDITOR */}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.permissions}>
        <h3>🔑 Your Permissions</h3>
        <ul style={styles.permissionList}>
          <li>✅ Create Posts</li>
          <li>✅ Edit Own Posts</li>
          <li>✅ Publish Own Posts</li>
          <li>❌ Delete Posts</li>
          <li>❌ Manage Users</li>
          <li>❌ System Settings</li>
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
    fontSize: '18px',
    marginBottom: '15px'
  },
  createBtn: {
    padding: '10px 20px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  formContainer: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #e9ecef'
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    fontSize: '16px',
    resize: 'vertical'
  },
  submitBtn: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  updateBtn: {
    padding: '10px 20px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  editActions: {
    display: 'flex',
    gap: '10px'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666'
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#999'
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
  editBtn: {
    padding: '6px 16px',
    background: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
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

export default EditorPanel;
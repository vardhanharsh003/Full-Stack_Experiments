import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============ MOCK USERS ============
const users = [
  { id: 1, name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' },
  { id: 2, name: 'Editor User', email: 'editor@test.com', password: 'password123', role: 'editor' },
  { id: 3, name: 'Viewer User', email: 'viewer@test.com', password: 'password123', role: 'viewer' }
];

// ============ MOCK POSTS ============
let postsData = [
  { id: 1, title: 'Public Post', content: 'Everyone can see this', author: 'Admin', status: 'published', createdAt: new Date().toISOString() },
  { id: 2, title: 'Admin Post', content: 'Only admins can edit this', author: 'Admin', status: 'published', createdAt: new Date().toISOString() },
  { id: 3, title: 'Editor Post', content: 'Editors can manage this', author: 'Editor', status: 'draft', createdAt: new Date().toISOString() }
];

// ============ JWT FUNCTIONS ============
const generateMockToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    role: user.role,
    exp: Date.now() + 3600000 
  }));
  const signature = btoa('mock-signature');
  return `${header}.${body}.${signature}`;
};

export const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    return null;
  }
};

// ============ AUTH FUNCTIONS ============
export const mockLogin = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const token = generateMockToken(user);
        resolve({ 
          token, 
          user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const mockRegister = async (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        reject(new Error('User already exists'));
      } else {
        const newUser = { id: users.length + 1, name, email, password, role: 'viewer' };
        users.push(newUser);
        const token = generateMockToken(newUser);
        resolve({ 
          token, 
          user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
        });
      }
    }, 500);
  });
};

// ============ POST CRUD FUNCTIONS ============
export const fetchPosts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [...postsData] });
    }, 500);
  });
};

export const createPost = async (postData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const newPost = {
        id: postsData.length + 1,
        ...postData,
        author: postData.author || 'Editor',
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      postsData = [newPost, ...postsData];
      resolve({ data: newPost });
    }, 500);
  });
};

export const publishPost = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = postsData.findIndex(p => p.id === id);
      if (postIndex === -1) {
        reject(new Error('Post not found'));
        return;
      }
      const updatedPost = { 
        ...postsData[postIndex], 
        status: 'published',
        publishedAt: new Date().toISOString()
      };
      postsData = postsData.map(p => p.id === id ? updatedPost : p);
      resolve({ data: updatedPost });
    }, 500);
  });
};

export const updatePost = async (id, updateData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = postsData.findIndex(p => p.id === id);
      if (postIndex === -1) {
        reject(new Error('Post not found'));
        return;
      }
      const updatedPost = {
        ...postsData[postIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      postsData = postsData.map(p => p.id === id ? updatedPost : p);
      resolve({ data: updatedPost });
    }, 500);
  });
};

export const deletePostAPI = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = postsData.findIndex(p => p.id === id);
      if (postIndex === -1) {
        reject(new Error('Post not found'));
        return;
      }
      postsData = postsData.filter(p => p.id !== id);
      resolve({ data: { success: true } });
    }, 500);
  });
};

export default api;
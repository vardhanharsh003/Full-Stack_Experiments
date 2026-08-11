import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchPosts as fetchPostsAPI,
  createPost as createPostAPI,
  publishPost as publishPostAPI,
  updatePost as updatePostAPI,
  deletePostAPI 
} from '../../services/api';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchPostsAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewPost = createAsyncThunk(
  'posts/createNewPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await createPostAPI(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const publishExistingPost = createAsyncThunk(
  'posts/publishExistingPost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await publishPostAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExistingPost = createAsyncThunk(
  'posts/updateExistingPost',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await updatePostAPI(id, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExistingPost = createAsyncThunk(
  'posts/deleteExistingPost',
  async (id, { rejectWithValue }) => {
    try {
      await deletePostAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  posts: [],
  loading: false,
  error: null
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(publishExistingPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updateExistingPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deleteExistingPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload);
      });
  }
});

export default postsSlice.reducer;
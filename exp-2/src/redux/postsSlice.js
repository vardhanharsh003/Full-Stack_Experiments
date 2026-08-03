import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [
    {
      id: 1,
      title: "Learn React",
      description: "React Components and Hooks",
      category: "Frontend",
    },
    {
      id: 2,
      title: "Redux Toolkit",
      description: "Modern State Management",
      category: "Programming",
    },
    {
      id: 3,
      title: "Node.js",
      description: "Backend JavaScript Runtime",
      category: "Backend",
    },
    {
      id: 4,
      title: "Express.js",
      description: "REST API Development",
      category: "Backend",
    },
    {
      id: 5,
      title: "CSS Animations",
      description: "Beautiful User Interfaces",
      category: "Frontend",
    },
  ],

  category: "All",
};

const postsSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const { setCategory } = postsSlice.actions;

export default postsSlice.reducer;
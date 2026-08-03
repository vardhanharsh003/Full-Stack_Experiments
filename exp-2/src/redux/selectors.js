import { createSelector } from "reselect";

// Basic Selectors
const selectPosts = (state) => state.posts.posts;
const selectCategory = (state) => state.posts.category;

// Memoized Selector
export const selectFilteredPosts = createSelector(
  [selectPosts, selectCategory],
  (posts, category) => {
    console.log("Selector Recomputed");

    if (category === "All") {
      return posts;
    }

    return posts.filter((post) => post.category === category);
  }
);
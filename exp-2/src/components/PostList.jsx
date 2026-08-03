import React from "react";
import { useSelector } from "react-redux";
import { selectFilteredPosts } from "../redux/selectors";

function PostList() {
  const posts = useSelector(selectFilteredPosts);

  return (
    <div className="posts">
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <h2>{post.title}</h2>

          <p>{post.description}</p>

          <span className="category">{post.category}</span>
        </div>
      ))}
    </div>
  );
}

export default React.memo(PostList);
import "./App.css";
import Filter from "./components/Filter";
import PostList from "./components/PostList";
import { useSelector } from "react-redux";
import { selectFilteredPosts } from "./redux/selectors";

function App() {
  const posts = useSelector(selectFilteredPosts);

  return (
    <div className="container">
      <h1>🚀 Redux Selector Optimization</h1>

      <div className="stats">
        <div className="card">
          <h3>Filtered Posts</h3>
          <h2>{posts.length}</h2>
        </div>

        <div className="card">
          <h3>Memoized Selector</h3>
          <h2>✅ Active</h2>
        </div>
      </div>

      <Filter />

      <PostList />
    </div>
  );
}

export default App;
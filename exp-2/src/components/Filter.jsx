import { useDispatch } from "react-redux";
import { setCategory } from "../redux/postsSlice";

function Filter() {
  const dispatch = useDispatch();

  return (
    <div className="filter">
      <label>Select Category</label>

      <select onChange={(e) => dispatch(setCategory(e.target.value))}>
        <option value="All">All</option>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="Programming">Programming</option>
      </select>
    </div>
  );
}

export default Filter;
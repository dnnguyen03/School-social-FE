import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsThunk } from "../redux/reducer/postReducer";
import Post from "../components/Post";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, status } = useSelector((state) => state.posts);
  const [activeTab, setActiveTab] = useState("forYou");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPostsThunk());
    }
  }, [status, dispatch]);

  return (
    <div className="max-w-screen-sm mx-auto bg-white rounded-lg mt-8 outline outline-1 outline-gray-300">
      <div className="sticky top-0 bg-white z-10 rounded-t-lg overflow-hidden">
        <div className="flex border-b text-gray-500 border-gray-300">
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === "forYou"
                ? "border-b-2 border-black bg-gray-50 text-black"
                : ""
            }`}
            onClick={() => setActiveTab("forYou")}
          >
            Dành cho bạn
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              activeTab === "following"
                ? "border-b-2 border-black bg-gray-50 text-black"
                : ""
            }`}
            onClick={() => setActiveTab("following")}
          >
            Đang theo dõi
          </button>
        </div>
      </div>

      <div className="h-auto overflow-visible">
        {status === "loading" && (
          <p className="text-center py-4">Đang tải...</p>
        )}
        {status === "failed" && (
          <p className="text-center py-4 text-red-500">
            Tải bài viết thất bại!
          </p>
        )}
        {status === "succeeded" &&
          posts.map((post) => <Post key={post._id} post={post} />)}
      </div>
    </div>
  );
};

export default Home;

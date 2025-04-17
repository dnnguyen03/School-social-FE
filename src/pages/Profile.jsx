import React from "react";
import { Edit, User } from "lucide-react";
import Post from "../components/Post";
import { openModal } from "../redux/reducer/modalReducer";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const posts = [
    {
      id: 1,
      username: user?.username || "Ẩn danh",
      time: "1 giờ trước",
      content: "Đây là bài đăng đầu tiên của tôi!",
      likes: 12,
      comments: 3,
      shares: 2,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      username: user?.username || "Ẩn danh",
      time: "Hôm qua",
      content: "Hôm nay trời đẹp quá!",
      likes: 45,
      comments: 10,
      shares: 5,
    },
  ];

  return (
    <div className="max-w-screen-sm mx-auto bg-white shadow-md rounded-lg p-4 mt-8 outline outline-1 outline-gray-300">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
          <User size={32} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {user?.fullName || "Tên của bạn"}
          </h2>
          <p className="text-gray-500 text-sm">
            {user?.username || "Tên đăng nhập"}
          </p>
          <p className="text-gray-400 text-sm">0 người theo dõi</p>
        </div>
      </div>

      <button className="mt-4 w-full py-2 border rounded-lg text-gray-700 flex items-center justify-center space-x-2 hover:bg-gray-100">
        <Edit size={16} />
        <span>Chỉnh sửa trang cá nhân</span>
      </button>
      <hr className="mt-4" />

      <div
        className="mt-4 flex items-center space-x-3 p-3 border rounded-lg cursor-pointer "
        onClick={() => dispatch(openModal())}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full overflow-hidden "></div>
        <p className="w-full text-gray-500 text-sm focus:outline-none">
          Có gì mới?
        </p>
        <button className="px-4 py-1 bg-black text-white text-sm rounded-lg">
          Đăng
        </button>
      </div>

      {/* Hiển thị bài đăng */}
      <div className="mt-4">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

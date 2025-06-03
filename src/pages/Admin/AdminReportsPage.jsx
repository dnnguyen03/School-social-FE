import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  getReportedPostsThunk,
  ignoreReportThunk,
  hidePostThunk,
  deleteReportedPostThunk,
} from "../../redux/reducer/postReducer";
import PostModal from "../../components/Modal/PostModal";
import { REPORT_REASONS } from "../../shared/reportReasons";
import { MoreVertical, Search } from "lucide-react";
import { unhidePost } from "../../services/postService";

dayjs.extend(relativeTime);

export default function AdminReportsPage() {
  const dispatch = useDispatch();
  const reportedPosts = useSelector((state) => state.posts.reportedPosts);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReason, setFilterReason] = useState("Tất cả");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRefs = useRef({});
  const buttonRefs = useRef({});

  useEffect(() => {
    dispatch(getReportedPostsThunk());
  }, [dispatch]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuOpenId) return;

      const menuEl = menuRefs.current[menuOpenId];
      const buttonEl = buttonRefs.current[menuOpenId];

      if (
        menuEl &&
        !menuEl.contains(event.target) &&
        buttonEl &&
        !buttonEl.contains(event.target)
      ) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  const nextMedia = () => {
    setDirection(1);
    setMediaIndex((prev) => (prev + 1) % (selectedPost?.media?.length || 1));
  };

  const prevMedia = () => {
    setDirection(-1);
    setMediaIndex(
      (prev) =>
        (prev - 1 + (selectedPost?.media?.length || 1)) %
        (selectedPost?.media?.length || 1)
    );
  };

  const handleAction = (action, id) => {
    if (action === "hide") {
      dispatch(hidePostThunk(id)).then(() => dispatch(getReportedPostsThunk()));
    } else if (action === "ignore") {
      dispatch(ignoreReportThunk(id)).then(() =>
        dispatch(getReportedPostsThunk())
      );
    } else if (action === "delete") {
      if (window.confirm("Bạn có chắc chắn muốn xoá bài viết này?")) {
        dispatch(deleteReportedPostThunk(id)).then(() =>
          dispatch(getReportedPostsThunk())
        );
      }
    } else if (action === "view") {
      const post = reportedPosts.find((p) => p._id === id);
      setSelectedPost(post);
      setMediaIndex(0);
      setShowModal(true);
    } else if (action === "unhide") {
      unhidePost(id).then(() => dispatch(getReportedPostsThunk()));
    }
    setMenuOpenId(null);
  };

  const filteredPosts = reportedPosts.filter((post) => {
    const usernameMatch = post.userId?.username
      ?.toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const reasonMatch =
      filterReason === "Tất cả" ||
      post.reports.some((r) => r.reason === filterReason);
    return usernameMatch && reasonMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Quản lý báo cáo bài viết</h1>

      {/* Tìm kiếm + lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo người đăng..."
            className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full sm:w-60">
          <select
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Tất cả">Tất cả lý do</option>
            {REPORT_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-900 text-sm text-white uppercase font-medium">
            <tr>
              <th className="px-4 py-3 text-left">Người đăng</th>
              <th className="px-4 py-3 text-left">Thời gian báo cáo</th>
              <th className="px-4 py-3 text-left">Lý do</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Không có bài viết phù hợp.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => {
                const lastReported = Math.max(
                  ...post.reports.map((r) => new Date(r.reportedAt))
                );
                return (
                  <tr
                    key={post._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{post.userId?.username}</td>
                    <td className="px-4 py-3">
                      {dayjs(lastReported).fromNow()}
                    </td>
                    <td className="px-4 py-3">
                      <ul className="list-disc list-inside space-y-1">
                        {post.reports.map((r, i) => (
                          <li key={i}>
                            <span className="text-gray-700">{r.reason}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.reportStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {post.reportStatus === "pending"
                          ? "⏳ Chưa xử lý"
                          : "🚫 Đã ẩn tạm thời"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center relative">
                      <button
                        ref={(el) => (buttonRefs.current[post._id] = el)}
                        onClick={() =>
                          setMenuOpenId((prev) =>
                            prev === post._id ? null : post._id
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {menuOpenId === post._id && (
                        <div
                          ref={(el) => (menuRefs.current[post._id] = el)}
                          className="absolute z-50 right-4 top-10 bg-white border shadow rounded w-40"
                        >
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                            onClick={() => handleAction("view", post._id)}
                          >
                            📄 Xem bài viết
                          </button>
                          {post.reportStatus === "hidden" ? (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600"
                              onClick={() => handleAction("unhide", post._id)}
                            >
                              👁️ Hiển thị lại
                            </button>
                          ) : (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-yellow-600"
                              onClick={() => handleAction("hide", post._id)}
                            >
                              🚫 Ẩn bài
                            </button>
                          )}

                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-600"
                            onClick={() => handleAction("ignore", post._id)}
                          >
                            ✅ Bỏ qua
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => handleAction("delete", post._id)}
                          >
                            🗑 Xoá bài
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          nextMedia={nextMedia}
          prevMedia={prevMedia}
          mediaIndex={mediaIndex}
          direction={direction}
          isAdminView={true}
        />
      )}
    </div>
  );
}

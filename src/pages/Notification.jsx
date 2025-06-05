import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/LoadSpinner";
import {
  fetchNotificationsThunk,
  markAllAsReadThunk,
  resetNotifications,
} from "../redux/reducer/notificationReducer";
import { AlertTriangle, MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
import api from "../services/api";
import PostModal from "../components/Modal/PostModal";
import { useLocation } from "react-router-dom";

export default function Notification() {
  const dispatch = useDispatch();
  const location = useLocation();
  const observerRef = useRef();

  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lastSeenAt, setLastSeenAt] = useState(null);

  const {
    list: notifications,
    loading,
    hasMore,
  } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotificationsThunk());
    return () => {
      dispatch(markAllAsReadThunk());
    };
  }, [dispatch]);

  // Infinite scroll: load thêm khi tới cuối
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const last = notifications[notifications.length - 1];
          if (last?.updatedAt) {
            setLastSeenAt(last.updatedAt);
            dispatch(fetchNotificationsThunk(last.updatedAt));
          }
        }
      },
      { threshold: 1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [notifications, loading, hasMore, dispatch]);

  const handleViewPost = async (post) => {
    try {
      if (typeof post === "object" && post.media) {
        setSelectedPost({ ...post, media: post.media ?? [] });
      } else {
        const res = await api.get(`/posts/${post._id}`);
        setSelectedPost({ ...res.data, media: res.data.media ?? [] });
      }
      setMediaIndex(0);
      setDirection(0);
      setShowModal(true);
    } catch (err) {
      console.error("Lỗi khi xem bài viết:", err);
    }
  };

  const handleNextMedia = () => {
    if (!selectedPost?.media || selectedPost.media.length <= 1) return;
    setDirection(1);
    setMediaIndex((prev) => (prev + 1) % selectedPost.media.length);
  };

  const handlePrevMedia = () => {
    if (!selectedPost?.media || selectedPost.media.length <= 1) return;
    setDirection(-1);
    setMediaIndex(
      (prev) =>
        (prev - 1 + selectedPost.media.length) % selectedPost.media.length
    );
  };

  return (
    <div className="max-w-screen-sm mx-auto bg-white shadow-md rounded-lg p-4 mt-8 outline outline-1 outline-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Thông báo</h2>
      </div>

      {notifications.length === 0 && !loading && (
        <p className="text-center text-gray-500">Không có thông báo nào</p>
      )}

      <div className="space-y-4">
        {notifications.map((noti, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg shadow-sm border ${
              noti.isRead
                ? "bg-gray-50 border-gray-200"
                : "bg-blue-50 border-blue-300"
            }`}
          >
            <div className="flex items-start gap-2">
              {!noti.isRead && (
                <span className="text-blue-500 text-xs pt-1">●</span>
              )}
              {noti.type === "like" && (
                <ThumbsUp size={16} className="text-blue-500 mt-0.5" />
              )}
              {noti.type === "comment" && (
                <MessageCircle size={16} className="text-green-500 mt-0.5" />
              )}
              {noti.type === "follow" && (
                <UserPlus size={16} className="text-blue-500 mt-0.5" />
              )}
              {noti.type === "warning" && (
                <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
              )}

              <div className="flex-1 text-sm text-gray-800 space-y-1">
                {noti.type === "warning" ? (
                  <>
                    <p>{noti.message}</p>
                    <div className="flex gap-4">
                      <button
                        className="text-blue-600 underline"
                        onClick={() => handleViewPost(noti.post)}
                      >
                        Xem bài viết
                      </button>
                      <button className="text-red-600 underline">
                        Gửi kháng cáo
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{noti.message}</p>
                    {["like", "comment"].includes(noti.type) && noti.post && (
                      <div className="mt-1">
                        <button
                          className="text-blue-600 underline text-sm"
                          onClick={() => handleViewPost(noti.post)}
                        >
                          Xem bài viết
                        </button>
                      </div>
                    )}
                  </>
                )}

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(noti.updatedAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <Spinner />}
      <div ref={observerRef} className="h-1" />

      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          nextMedia={handleNextMedia}
          prevMedia={handlePrevMedia}
          mediaIndex={mediaIndex}
          direction={direction}
          isAdminView={false}
        />
      )}
    </div>
  );
}

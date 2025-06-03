import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDispatch, useSelector } from "react-redux";
import PostActions from "./PostAction";
import { likePostThunk, commentPostThunk } from "../redux/reducer/postReducer";
import { Send, User } from "lucide-react";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const RenderInfo = ({ post, isAdminView = false }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.user.username);
  const { user } = useSelector((state) => state.auth);

  const likesIds = Array.isArray(post.likes)
    ? post.likes
        .filter((l) => l)
        .map((l) => (l._id ? l._id.toString() : l.toString()))
    : [];

  const currentUserId = user?._id?.toString() || user?.id?.toString();
  const hasLiked = likesIds.includes(currentUserId);
  const [newComment, setNewComment] = useState("");
  const handleLike = () => {
    dispatch(likePostThunk({ postId: post._id }));
  };

  const sendComment = () => {
    const text = newComment.trim();
    if (!text) return;
    dispatch(commentPostThunk({ postId: post._id, content: text }));
    setNewComment("");
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendComment();
    }
  };
  return (
    <>
      {/* User Info */}
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {post.userId?.avatarUrl ? (
            <img
              src={post.userId.avatarUrl}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} className="text-gray-500" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-base">
            {post.userId?.username || username}
          </h3>
          <p className="text-sm text-gray-500">
            {dayjs(post.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-line leading-relaxed">
        {post.content}
      </p>

      {/* Actions */}
      {!isAdminView && (
        <>
          <PostActions
            likeCount={likesIds.length}
            comments={post.comments}
            shares={post.repostCount}
            hasLiked={hasLiked}
            onLike={handleLike}
            onComment={() => {}}
          />

          <div className="border-t pt-4 flex flex-col h-full">
            <h4 className="font-semibold text-sm mb-3 text-gray-700">
              Bình luận
            </h4>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {post.comments.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {c.userId?.avatarUrl ? (
                      <img
                        src={c.userId.avatarUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-gray-500" />
                    )}
                  </div>
                  <div className="bg-gray-100 p-3 rounded-xl w-full">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">
                        {c.userId?.username || "Khách"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dayjs(c.createdAt).fromNow()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white pt-2 pb-2 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-gray-500" />
                )}
              </div>
              <div className="relative flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Viết bình luận..."
                  className="w-full bg-gray-200 resize-none rounded-full py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                />
                <button
                  onClick={sendComment}
                  disabled={!newComment.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-blue-100 disabled:opacity-50 transition"
                >
                  <Send size={20} className="text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RenderInfo;

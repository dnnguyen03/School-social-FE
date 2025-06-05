import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostModal from "./Modal/PostModal";
import MediaPreview from "./MediaPreview";
import PostActions from "./PostAction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Ellipsis, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { setEditPostData } from "../redux/reducer/modalReducer";
import ConfirmDeleteDialog from "./Modal/ConfirmDeleteDialog";
import { likePostThunk, reportPostThunk } from "../redux/reducer/postReducer";
import ReportDialog from "./Modal/ReportDialog";
import { toast } from "react-toastify";
dayjs.extend(relativeTime);

const Post = ({ post }) => {
  if (!post) return null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const username = user?.username;
  const [showReportDialog, setShowReportDialog] = useState(false);

  const likesIds = Array.isArray(post.likes)
    ? post.likes
        .filter((like) => like)
        .map((like) => {
          if (like._id) return like._id.toString();
          return like.toString();
        })
    : [];
  const currentUserId = user?._id?.toString() || user?.id?.toString();

  const hasLiked = currentUserId ? likesIds.includes(currentUserId) : false;

  const nextMedia = () => {
    setDirection(1);
    setMediaIndex((prev) => (prev + 1) % post.media.length);
  };

  const prevMedia = () => {
    setDirection(-1);
    setMediaIndex((prev) => (prev - 1 + post.media.length) % post.media.length);
  };

  const handleMenuToggle = () => setShowMenu(!showMenu);
  const handleCloseMenu = () => setShowMenu(false);

  const handleReport = () => {
    setShowReportDialog(true);
    handleCloseMenu();
  };

  const handleReportSubmit = (reason) => {
    if (!currentUserId) return alert("Vui lòng đăng nhập trước khi báo cáo.");

    dispatch(
      reportPostThunk({ postId: post._id, userId: currentUserId, reason })
    )
      .unwrap()
      .then(() => {
        setShowReportDialog(false);
        toast.success("Đã gửi báo cáo thành công", {
          autoClose: 3000,
        });
      })
      .catch((error) => {
        toast.error("Không thể gửi báo cáo: Bạn đã báo cáo trước đó", {
          autoClose: 3000,
        });
      });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    handleCloseMenu();
  };

  const handleLike = () => {
    dispatch(likePostThunk({ postId: post._id }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const isOwnPost = post.userId?.username === username;
  return (
    <div className="bg-white p-4 pb-0 shadow-md relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-200">
      <div className="flex items-center mb-2">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(`/profile/${post.userId._id}`)}
        >
          <div className="w-10 h-10 mr-3">
            {post.userId?.avatarUrl ? (
              <img
                src={post.userId?.avatarUrl}
                alt={post.userId.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base">{post.userId?.username}</h3>
            <p className="text-sm text-gray-500">
              {dayjs(post.createdAt).format("HH:mm - D/M/YYYY")}
            </p>
          </div>
        </div>

        <button className="ml-auto" onClick={handleMenuToggle}>
          <Ellipsis size={20} />
        </button>
      </div>

      <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
        <p className="whitespace-pre-line line-clamp-4 pb-1">{post.content}</p>
        {post.content.length > 350 ? (
          <span className="text-blue-500 font-medium">Xem thêm...</span>
        ) : null}
      </div>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.1 }}
            className="absolute top-10 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-lg w-36 py-2"
          >
            {isOwnPost ? (
              <>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                  onClick={() => {
                    dispatch(setEditPostData(post));
                    handleCloseMenu();
                  }}
                >
                  Sửa
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-500 dark:text-red-400 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-700 dark:hover:text-red-300"
                  onClick={handleDelete}
                >
                  Xóa
                </button>
              </>
            ) : (
              <button
                className="block w-full text-left px-4  text-gray-700 dark:text-gray-300 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                onClick={handleReport}
              >
                Báo cáo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <MediaPreview media={post.media} onClick={() => setIsOpen(true)} />

      <PostActions
        likeCount={likesIds.length}
        comments={post.comments}
        shares={post.shares}
        hasLiked={hasLiked}
        onLike={handleLike}
        onComment={setIsOpen}
      />

      <PostModal
        post={post}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        nextMedia={nextMedia}
        prevMedia={prevMedia}
        mediaIndex={mediaIndex}
        direction={direction}
      />

      <ConfirmDeleteDialog
        show={showDeleteConfirm}
        postId={post._id}
        onClose={() => setShowDeleteConfirm(false)}
      />

      <ReportDialog
        show={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Post;

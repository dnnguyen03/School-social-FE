import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { closeModal } from "../../../redux/reducer/modalReducer";
import {
  createPostThunk,
  updatePostThunk,
} from "../../../redux/reducer/postReducer";

import PostHeader from "./PostHeader";
import PostTextarea from "./PostTextarea";
import MediaPreview from "./MediaPreview";
import PostFooter from "./PostFooter";
import ConfirmCloseDialog from "./ConfirmCloseDialog";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const CreatePostModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.createPostModal);
  const user = useSelector((state) => state.auth.user);

  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editPostData = useSelector((state) => state.modal.editPostData);

  const maxCharacters = 280;

  useEffect(() => {
    if (editPostData) {
      setContent(editPostData.content || "");
      setPrivacy(editPostData.privacy || "public");
      setMediaFiles(editPostData.media || []);
    }
  }, [editPostData]);

  const handleCreatePost = async () => {
    if ((!content.trim() && mediaFiles.length === 0) || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const uploadedMediaUrls = [];

      for (const file of mediaFiles) {
        if (typeof file === "string" || file.url) {
          uploadedMediaUrls.push(file);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/auto/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (!data.secure_url) throw new Error("Upload thất bại");

        uploadedMediaUrls.push({
          url: data.secure_url,
          type: data.resource_type === "video" ? "video" : "image",
        });
      }

      const postData = {
        content,
        userId: user.id,
        username: user.username,
        privacy,
        media: uploadedMediaUrls,
      };

      if (editPostData) {
        // Gọi update post thunk
        await dispatch(
          updatePostThunk({
            postId: editPostData._id,
            content: postData.content,
            media: postData.media,
            privacy: postData.privacy,
            userId: editPostData.userId,
            username: editPostData.username,
          })
        );
        toast.success("Đã cập nhật bài viết thành công", {
          autoClose: 3000,
        });
      } else {
        await dispatch(createPostThunk(postData));
        toast.success("Đăng bài thành công!", {
          autoClose: 3000,
        });
      }

      dispatch(closeModal());
      setContent("");
      setMediaFiles([]);
    } catch (error) {
      console.error("Upload media thất bại:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          onClick={() => dispatch(closeModal())}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-xl rounded-xl shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1"
              onClick={() => {
                if (content.trim() || mediaFiles.length > 0) {
                  setShowConfirmClose(true);
                } else {
                  dispatch(closeModal());
                }
              }}
            >
              <X size={20} />
            </button>
            <PostHeader
              user={user}
              content={content}
              mediaFiles={mediaFiles}
              privacy={privacy}
              setPrivacy={setPrivacy}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setShowConfirmClose={setShowConfirmClose}
            />

            <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <PostTextarea
                content={content}
                setContent={setContent}
                isSubmitting={isSubmitting}
                mediaFiles={mediaFiles}
                maxCharacters={maxCharacters}
              />

              <MediaPreview
                mediaFiles={mediaFiles}
                setMediaFiles={setMediaFiles}
              />
            </div>

            <PostFooter
              content={content}
              mediaFiles={mediaFiles}
              maxCharacters={maxCharacters}
              isSubmitting={isSubmitting}
              setMediaFiles={setMediaFiles}
              handleCreatePost={handleCreatePost}
            />

            <ConfirmCloseDialog
              show={showConfirmClose}
              isEditing={!!editPostData}
              onCancel={() => setShowConfirmClose(false)}
              onConfirm={() => {
                dispatch(closeModal());
                setContent("");
                setMediaFiles([]);
                setShowConfirmClose(false);
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;

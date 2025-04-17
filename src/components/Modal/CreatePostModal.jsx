import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Image, Globe, Users, ChevronDown, Lock } from "lucide-react";
import { closeModal } from "../../redux/reducer/modalReducer";
import { motion, AnimatePresence } from "framer-motion";
import { createPostThunk } from "../../redux/reducer/postReducer";

const CreatePostModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.createPostModal);
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const maxCharacters = 280;
  const user = useSelector((state) => state.auth.user);

  const privacyOptions = [
    { label: "Công khai", value: "public", icon: <Globe size={16} /> },
    { label: "Bạn bè", value: "friends", icon: <Users size={16} /> },
    { label: "Riêng tư", value: "private", icon: <Lock size={16} /> },
  ];
  const selectedOption = privacyOptions.find((opt) => opt.value === privacy);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };
  const handleCreatePost = async () => {
    if (!content.trim()) return;

    try {
      const uploadedMediaUrls = [];

      for (const file of mediaFiles) {
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
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        console.log("data: " + data);
        uploadedMediaUrls.push({
          url: data.secure_url,
          type: data.secure_url.includes("/video/upload") ? "video" : "image",
        });
      }

      const postData = {
        content,
        userId: user._id,
        privacy,
        media: uploadedMediaUrls,
      };
      console.log(postData);

      dispatch(createPostThunk(postData));
      dispatch(closeModal());
      setContent("");
      setMediaFiles([]);
    } catch (error) {
      console.error("Upload media thất bại:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            className="bg-white w-full max-w-xl rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Tạo bài viết</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  if (content.trim() || mediaFiles.length > 0) {
                    setShowConfirmClose(true); // Hiện popup
                  } else {
                    dispatch(closeModal()); // Không có gì thì đóng luôn
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* User info + privacy */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">{user.username}</p>

                  <div className="relative mt-1 dropdown-container max-w-fit">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                      onClick={() => setShowDropdown((prev) => !prev)}
                    >
                      {selectedOption.icon}
                      {selectedOption.label}
                      <ChevronDown size={16} />
                    </button>

                    {showDropdown && (
                      <motion.div
                        className="absolute z-10 mt-2 bg-white border rounded-md shadow w-44"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {privacyOptions.map((option) => (
                          <button
                            key={option.value}
                            className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                            onClick={() => {
                              setPrivacy(option.value);
                              setShowDropdown(false);
                            }}
                          >
                            {option.icon}
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                className="w-full border rounded-lg p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Bạn đang nghĩ gì?"
                rows={3}
                maxLength={maxCharacters}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              ></textarea>

              {/* Preview media */}
              {mediaFiles.length > 0 && (
                <div className="mt-3 rounded-lg overflow-hidden max-h-80 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mediaFiles.map((file, idx) => {
                      const isImage = file.type.startsWith("image/");
                      const isVideo = file.type.startsWith("video/");

                      return (
                        <div key={idx} className="relative group">
                          {isImage && (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${idx}`}
                              className="w-full h-40 object-cover rounded"
                            />
                          )}

                          {isVideo && (
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-40 object-cover rounded"
                              muted
                              controls
                            />
                          )}

                          <button
                            onClick={() =>
                              setMediaFiles((prev) =>
                                prev.filter((_, index) => index !== idx)
                              )
                            }
                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            title="Xóa"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t space-y-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    hidden
                    id="mediaInput"
                    onChange={handleMediaChange}
                  />
                  <label
                    htmlFor="mediaInput"
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-1 text-sm text-gray-700"
                  >
                    <Image size={18} />
                    Thêm ảnh/video
                  </label>
                </div>
                <span className="text-sm text-gray-400">
                  {content.length}/{maxCharacters} ký tự
                </span>
              </div>

              {/* Submit button */}
              <button
                className={`w-full py-2 rounded-lg text-sm font-semibold ${
                  content.trim() || mediaFiles.length > 0
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!content.trim() && mediaFiles.length === 0}
                onClick={handleCreatePost}
              >
                Đăng bài
              </button>
            </div>
            {showConfirmClose && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[99999]">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-3">Hủy bài viết?</h3>
                  <p className="text-sm text-gray-600 mb-5">
                    Mọi nội dung đang viết sẽ bị xóa. Bạn có chắc chắn?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => setShowConfirmClose(false)}
                    >
                      Tiếp tục viết
                    </button>
                    <button
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => {
                        setShowConfirmClose(false);
                        dispatch(closeModal());
                        setContent("");
                        setMediaFiles([]);
                      }}
                    >
                      Hủy bài viết
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;

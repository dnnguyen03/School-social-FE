import { Image } from "lucide-react";

const PostFooter = ({
  content,
  mediaFiles,
  maxCharacters,
  isSubmitting,
  setMediaFiles,
  handleCreatePost,
}) => (
  <div className="px-5 py-4 border-t space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          id="mediaInput"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setMediaFiles((prev) => [...prev, ...files]);
            e.target.value = "";
          }}
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

    <button
      className={`w-full py-2 rounded-lg text-sm font-semibold transition ${
        content.trim() || mediaFiles.length > 0
          ? "bg-black text-white hover:bg-gray-800"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={(!content.trim() && mediaFiles.length === 0) || isSubmitting}
      onClick={handleCreatePost}
    >
      {isSubmitting ? "Đang đăng..." : "Đăng bài"}
    </button>
  </div>
);

export default PostFooter;

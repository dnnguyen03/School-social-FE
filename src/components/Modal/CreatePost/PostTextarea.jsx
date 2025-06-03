const PostTextarea = ({
  content,
  setContent,
  isSubmitting,
  mediaFiles,
  maxCharacters,
}) => (
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
    onKeyDown={(e) => {
      if (
        e.key === "Enter" &&
        (isSubmitting || (!content.trim() && mediaFiles.length === 0))
      ) {
        e.preventDefault();
      }
    }}
  />
);

export default PostTextarea;

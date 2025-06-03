import { MessageSquare, Repeat, ThumbsUp } from "lucide-react";

const PostActions = ({
  likeCount,
  comments = [],
  shares = 0,
  onLike,
  onComment,
  hasLiked,
}) => (
  <div className="flex justify-between text-sm py-3">
    <button
      onClick={onLike}
      className={`flex items-center gap-1 transition-colors duration-200
       ${hasLiked ? "text-blue-600" : "text-gray-600"}
       hover:text-blue-500`}
    >
      <ThumbsUp size={18} className={hasLiked ? "fill-current" : ""} />
      {likeCount}
    </button>
    <button
      onClick={() => onComment(true)}
      className="hover:text-blue-500 flex items-center gap-1"
    >
      <MessageSquare size={18} /> {comments.length}
    </button>
    <button className="hover:text-blue-500 flex items-center gap-1">
      {/* <Repeat size={18} /> {shares} */}
    </button>
  </div>
);

export default PostActions;

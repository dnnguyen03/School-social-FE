import { MessageSquare, Repeat, ThumbsUp } from "lucide-react";

const Post = ({ post }) => {
  return (
    <div className="bg-white p-4 shadow-md relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-400">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <div>
          <h3 className="font-bold">{post.username}</h3>
          <p className="text-sm text-gray-500">{post.time}</p>
        </div>
      </div>

      <p className="mb-2">{post.content}</p>

      {post.image && (
        <img src={post.image} alt="Post" className="w-full rounded-lg mb-2" />
      )}

      <div className="flex gap-6 text-gray-600 text-sm">
        <button className="hover:text-blue-500 flex">
          <ThumbsUp size={20} className="mr-1" /> {post.likes}
        </button>
        <button className="hover:text-blue-500 flex">
          <MessageSquare size={20} className="mr-1" /> {post.comments}
        </button>
        <button className="hover:text-blue-500 flex">
          <Repeat size={20} className="mr-1" /> {post.shares}
        </button>
      </div>
    </div>
  );
};

export default Post;

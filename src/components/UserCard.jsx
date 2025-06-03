import { User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserCard({ user, onFollow, onUnfollow, loadingIds }) {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <div
      key={user._id}
      className="flex items-center justify-between border-b py-3 cursor-pointer"
      onClick={goToProfile}
    >
      <div className="flex items-start space-x-3 w-full">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="text-gray-500 w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0 pr-2">
          <p className="font-semibold text-base truncate">{user.name}</p>
          <p className="text-gray-400 text-sm">{user.username}</p>
          <p className="text-gray-500 text-base break-words whitespace-normal">
            {user.bio}
          </p>
          <p className="text-gray-400 text-base">{user.followers}</p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          user.isFollowed ? onUnfollow(user._id) : onFollow(user._id);
        }}
        disabled={loadingIds.includes(user._id)}
        className={`text-sm px-4 py-1 rounded-md flex-shrink-0 border transition ${
          user.isFollowed
            ? "bg-white text-black border-black"
            : "bg-black text-white border-transparent"
        } ${loadingIds.includes(user._id) && "opacity-50 cursor-wait"}`}
      >
        {loadingIds.includes(user._id)
          ? "Đang xử lý..."
          : user.isFollowed
          ? "Đang theo dõi"
          : "Theo dõi"}
      </button>
    </div>
  );
}

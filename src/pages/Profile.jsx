import React, { useEffect, useState } from "react";
import { Edit, User, UserPlus, UserCheck } from "lucide-react";
import Post from "../components/Post";
import { openEditProfileModal, openModal } from "../redux/reducer/modalReducer";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostsByUserIdThunk } from "../redux/reducer/postReducer";
import { getUser, followUser, unfollowUser } from "../services/usreService";
import Spinner from "../components/LoadSpinner";

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const currentUser = useSelector((state) => state.auth.user);
  const isCurrentUser =
    String(currentUser?.id) === String(id) ||
    String(currentUser?._id) === String(id);
  const displayUser = isCurrentUser ? currentUser : profileUser;
  const posts = useSelector((state) => state.posts.userPosts);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          let data;
          if (isCurrentUser) {
            data = currentUser;
          } else {
            data = await getUser(id);
          }
          setProfileUser(data);

          const isFollowed = data.followers?.some(
            (follower) => follower === String(currentUser?._id)
          );
          setIsFollowing(isFollowed);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
        dispatch(fetchPostsByUserIdThunk(id));

        setTimeout(() => {
          setInitialLoading(false);
        }, 350);
      };

      fetchData();
    }
  }, [id, dispatch, currentUser?.id]);

  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser(id);
      setIsFollowing(false);
    } else {
      await followUser(id);
      setIsFollowing(true);
    }
  };

  if (initialLoading) return <Spinner />;

  return (
    <div className="max-w-screen-sm mx-auto bg-white shadow-md rounded-lg p-4 mt-8 outline outline-1 outline-gray-300">
      {/* Header */}
      <div className="flex items-center space-x-4">
        {displayUser?.avatarUrl ? (
          <img
            src={displayUser.avatarUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={32} className="text-gray-500" />
          </div>
        )}

        <div className="flex-grow">
          <h2 className="text-xl font-semibold">
            {displayUser?.fullName || "Tên của bạn"}
          </h2>
          <p className="text-gray-500 text-sm">
            {displayUser?.username || "Tên đăng nhập"}
          </p>
          <p className="text-gray-400 text-sm">
            {displayUser?.followers?.length || 0} người theo dõi
          </p>
          {displayUser?.bio && (
            <p className="w-60 text-gray-600 text-sm mt-1 break-words whitespace-pre-line">
              {displayUser.bio}
            </p>
          )}
        </div>

        {isCurrentUser ? (
          <button
            onClick={() => dispatch(openEditProfileModal())}
            className="py-2 px-4 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Chỉnh sửa trang cá nhân</span>
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className={`py-2 px-4 border rounded-lg flex items-center space-x-2 transition-colors duration-300 ${
              isFollowing
                ? "bg-white text-black border-black"
                : "bg-black text-white hover:bg-gray-700"
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck size={16} />
                <span>Đang theo dõi</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Follow</span>
              </>
            )}
          </button>
        )}
      </div>

      {isCurrentUser && (
        <>
          <hr className="mt-4" />

          <div
            className="mt-4 flex items-center space-x-3 p-3 border rounded-lg cursor-pointer"
            onClick={() => dispatch(openModal())}
          >
            {displayUser?.avatarUrl ? (
              <img
                src={displayUser.avatarUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div className="w-12 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={18} className="text-gray-500" />
              </div>
            )}
            <p className="w-full text-gray-500 text-sm focus:outline-none">
              Có gì mới?
            </p>
            <button className="px-4 py-1 bg-black text-white text-sm rounded-lg">
              Đăng
            </button>
          </div>
        </>
      )}

      <div className="mt-4">
        {posts?.length > 0 &&
          posts.map((post) => <Post key={post._id} post={post} />)}
      </div>
    </div>
  );
}

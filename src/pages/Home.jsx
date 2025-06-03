import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicPostsThunk,
  fetchFollowingPostsThunk,
  searchPostsThunk,
} from "../redux/reducer/postReducer";
import Post from "../components/Post";
import { useLocation } from "react-router-dom";
import Spinner from "../components/LoadSpinner";
import { Search } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { posts, status, followingPosts, searchedPosts, searchStatus } =
    useSelector((state) => state.posts);
  const currentUser = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("forYou");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const observerRef = useRef(null);
  const lastPostRef = useRef(null);
  const isLoadingMore = useRef(false);

  const isForYou = activeTab === "forYou";
  const visiblePosts = isSearching
    ? searchedPosts
    : isForYou
    ? posts
    : followingPosts;
  const currentStatus = isSearching
    ? searchStatus
    : isForYou
    ? status.forYou
    : status.following;

  useEffect(() => {
    if (!currentUser?.id || isSearching) return;
    setLocalLoading(true);

    const timer = setTimeout(() => {
      const action = isForYou
        ? fetchPublicPostsThunk()
        : fetchFollowingPostsThunk({ userId: currentUser.id });

      dispatch(action).finally(() => setLocalLoading(false));
    }, 350);

    return () => clearTimeout(timer);
  }, [activeTab, dispatch, currentUser?.id, location.pathname, isSearching]);

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore.current || localLoading) return;

    const postList = visiblePosts;
    if (postList.length === 0) return;

    isLoadingMore.current = true;
    const lastCreatedAt = postList[postList.length - 1].createdAt;

    try {
      const action = isSearching
        ? searchPostsThunk({ query: searchValue, lastCreatedAt })
        : isForYou
        ? fetchPublicPostsThunk(lastCreatedAt)
        : fetchFollowingPostsThunk({ userId: currentUser.id, lastCreatedAt });

      await dispatch(action);
    } finally {
      setTimeout(() => {
        isLoadingMore.current = false;
      }, 1000);
    }
  }, [
    dispatch,
    visiblePosts,
    isForYou,
    currentUser.id,
    localLoading,
    isSearching,
    searchValue,
  ]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) loadMorePosts();
      },
      { root: null, rootMargin: "300px", threshold: 0.1 }
    );

    observerRef.current = observer;

    const timer = setTimeout(() => {
      if (lastPostRef.current) {
        observer.observe(lastPostRef.current);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [visiblePosts.length, loadMorePosts]);

  const sentinelRef = useCallback(
    (node) => {
      lastPostRef.current = node;
      if (node && observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current.observe(node);
      }
    },
    [activeTab, isSearching]
  );

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (trimmed.length === 0) return;

    setIsSearching(true);
    dispatch(searchPostsThunk({ query: trimmed }));
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.trim() === "") {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto bg-white rounded-lg mt-8 mb-8 outline outline-1 outline-gray-300">
      {/* Thanh tìm kiếm */}
      <div className="sticky top-0 z-20 bg-white p-4 border-b border-gray-300">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm bài viết..."
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[73px] bg-white z-10 rounded-t-lg overflow-hidden">
        <div className="flex border-b text-gray-500 border-gray-300">
          <button
            className={`flex-1 py-3 text-center ${
              isForYou && !isSearching
                ? "border-b-2 border-black bg-gray-50 text-black"
                : ""
            }`}
            onClick={() => {
              setActiveTab("forYou");
              setIsSearching(false);
              setSearchValue("");
            }}
          >
            Dành cho bạn
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              !isForYou && !isSearching
                ? "border-b-2 border-black bg-gray-50 text-black"
                : ""
            }`}
            onClick={() => {
              setActiveTab("following");
              setIsSearching(false);
              setSearchValue("");
            }}
          >
            Đang theo dõi
          </button>
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div>
        {(currentStatus === "loading" || localLoading) && <Spinner />}
        {!localLoading && currentStatus === "failed" && (
          <p className="text-center py-4 text-red-500">
            Tải bài viết thất bại!
          </p>
        )}
        {!localLoading && visiblePosts.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            Không có bài viết nào.
          </p>
        )}
        {!localLoading &&
          visiblePosts.map((post) => <Post key={post._id} post={post} />)}
        {!localLoading && visiblePosts.length > 0 && (
          <div
            ref={sentinelRef}
            className="py-4 text-center text-xs bg-white"
          />
        )}
      </div>
    </div>
  );
};

export default Home;

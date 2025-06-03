import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  suggestUserThunk,
  searchUsersThunk,
  followUserThunk,
  unfollowUserThunk,
} from "../redux/reducer/userReduce";
import useDebounce from "../hook/useDebounce";
import SearchInput from "../components/SearchInput";
import Suggestions from "../components/Suggestions";
import Spinner from "../components/LoadSpinner";

export default function SearchPage() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { suggestedUsers, searchResults, loadingIds } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
      if (debouncedSearchTerm.trim() === "") {
        dispatch(suggestUserThunk());
      } else {
        dispatch(searchUsersThunk(debouncedSearchTerm));
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, dispatch]);

  const handleFollow = (userId) => {
    dispatch(followUserThunk(userId));
  };

  const handleUnfollow = (userId) => {
    dispatch(unfollowUserThunk(userId));
  };

  const usersToDisplay =
    debouncedSearchTerm.trim() === "" ? suggestedUsers : searchResults;

  return (
    <div className="max-w-screen-sm min-h-full mx-auto bg-white shadow-md rounded-lg p-4 mt-8 outline outline-1 outline-gray-300">
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-lg font-semibold">Tìm kiếm</h2>
      </div>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />

      {initialLoading ? (
        <Spinner />
      ) : (
        <Suggestions
          users={usersToDisplay}
          loadingIds={loadingIds}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          debouncedSearchTerm={debouncedSearchTerm}
        />
      )}
    </div>
  );
}

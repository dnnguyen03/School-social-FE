import UserCard from "./UserCard";

export default function Suggestions({
  users,
  loadingIds,
  onFollow,
  onUnfollow,
  debouncedSearchTerm,
}) {
  return (
    <div>
      {debouncedSearchTerm.trim() === "" && (
        <h3 className="text-sm text-gray-500 mb-2">Gợi ý theo dõi</h3>
      )}
      {users.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Không tìm thấy người dùng phù hợp.
        </p>
      ) : (
        users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            isLoading={loadingIds.includes(user._id)}
            loadingIds={loadingIds}
          />
        ))
      )}
    </div>
  );
}

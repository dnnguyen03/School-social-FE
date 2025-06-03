import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2, RotateCcw, Search } from "lucide-react";
import dayjs from "dayjs";
import {
  deleteUserThunk,
  getAllUsersThunk,
  restoreUserThunk,
  updateUserByIdThunk,
} from "../../redux/reducer/userReduce";
import UserEditModal from "../../components/Modal/UserEditModal";

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const [roleFilter, setRoleFilter] = useState("all");
  const [localPage, setLocalPage] = useState(1); // local page
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { adminUserList: users, totalPages } = useSelector(
    (state) => state.user
  );
  const currentUser = useSelector((state) => state.auth.user);

  const usersPerPage = 5;

  useEffect(() => {
    dispatch(
      getAllUsersThunk({
        page: localPage,
        limit: usersPerPage,
        role: roleFilter,
      })
    );
  }, [dispatch, localPage, roleFilter]);

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLocalPage(newPage);
    }
  };

  const daysLeftToPurge = (deletedAt) => {
    const days = 30 - dayjs().diff(dayjs(deletedAt), "day");
    return days > 0 ? `${days} ngày còn lại` : "Hết hạn";
  };

  const handleDelete = (userId) => {
    dispatch(deleteUserThunk(userId)).then((action) => {
      if (!action.error) {
        dispatch(
          getAllUsersThunk({
            page: localPage,
            limit: usersPerPage,
            role: roleFilter,
          })
        );
      }
    });
  };

  const handleRestore = (userId) => {
    if (
      window.confirm("Bạn có chắc chắn muốn khôi phục tài khoản này không?")
    ) {
      dispatch(restoreUserThunk(userId)).then((action) => {
        if (!action.error) {
          dispatch(
            getAllUsersThunk({
              page: localPage,
              limit: usersPerPage,
              role: roleFilter,
            })
          );
        }
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Quản lý người dùng</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập tên người dùng cần tìm"
            className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setLocalPage(1);
          }}
          className="ml-4 border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="all">Tất cả</option>
          <option value="admin">Chỉ Admin</option>
          <option value="user">Chỉ User thường</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-900 text-sm text-white uppercase font-medium">
            <tr>
              <th className="px-4 py-3 text-left">Họ tên</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Admin</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có người dùng nào.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{user.fullName}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    {user.isAdmin ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : (
                      <span className="text-red-500 font-bold">✗</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.isDeleted ? (
                      <span className="text-orange-600 font-semibold">
                        🗑 Đã xoá ({daysLeftToPurge(user.deletedAt)})
                      </span>
                    ) : user.isLocked ? (
                      <span className="text-yellow-600 font-semibold">
                        🔒 Đã khoá
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        ✅ Bình thường
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    {user._id !== currentUser.id && (
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Edit size={16} />
                      </button>
                    )}

                    {user.isDeleted ? (
                      <button
                        onClick={() => handleRestore(user._id)}
                        className="p-1.5 rounded bg-green-500 text-white hover:bg-green-600"
                      >
                        <RotateCcw size={16} />
                      </button>
                    ) : (
                      user._id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Bạn có chắc chắn muốn xoá người dùng này không?"
                              )
                            ) {
                              handleDelete(user._id);
                            }
                          }}
                          className="p-1.5 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => changePage(localPage - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            disabled={localPage === 1}
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                localPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(localPage + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            disabled={localPage === totalPages}
          >
            Tiếp
          </button>
        </div>
      )}

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isSuperAdmin={currentUser?.isSuperAdmin}
          onClose={() => setSelectedUser(null)}
          onSave={(updated) => {
            dispatch(
              updateUserByIdThunk({ userId: selectedUser._id, data: updated })
            ).then(() => {
              dispatch(
                getAllUsersThunk({
                  page: localPage,
                  limit: usersPerPage,
                  role: roleFilter,
                })
              );
            });
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

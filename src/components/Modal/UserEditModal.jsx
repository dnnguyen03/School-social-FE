// ✅ EditProfileModal.jsx
import React, { useState } from "react";
import { Camera, User, X } from "lucide-react";

export default function EditProfileModal({
  user,
  onClose,
  onSave,
  isSuperAdmin,
}) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");
  const [isAdmin, setIsAdmin] = useState(user.isAdmin || false);
  const [isLocked, setIsLocked] = useState(user.isLocked || false);
  const [isDeleted, setIsDeleted] = useState(user.isDeleted || false);

  const handleSubmit = () => {
    const updated = {
      fullName,
      username,
      email,
      bio,
      isAdmin,
      isLocked,
      isDeleted,
      avatarUrl,
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-5 text-center">
          Chỉnh sửa người dùng
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border">
              <User size={30} className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm text-gray-700 mb-1"
              htmlFor="fullName"
            >
              Họ tên
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>

          <div>
            <label
              className="block text-sm text-gray-700 mb-1"
              htmlFor="username"
            >
              Tên đăng nhập
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="bio">
              Giới thiệu
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>

          {isSuperAdmin && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="admin-toggle"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label htmlFor="admin-toggle" className="text-sm text-gray-700">
                Cấp quyền Admin
              </label>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="lock-toggle"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
            />
            <label htmlFor="lock-toggle" className="text-sm text-gray-700">
              Khoá tài khoản
            </label>
          </div>

          {user.isDeleted && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="restore-toggle"
                checked={!isDeleted}
                onChange={(e) => setIsDeleted(!e.target.checked)}
              />
              <label htmlFor="restore-toggle" className="text-sm text-gray-700">
                Khôi phục tài khoản đã xoá
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

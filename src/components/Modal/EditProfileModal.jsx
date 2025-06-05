import { useState, useEffect, useMemo } from "react";
import { Camera, User, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserThunk } from "../../redux/reducer/userReduce";
import { closeEditProfileModal } from "../../redux/reducer/modalReducer";
import { setAuthUser } from "../../redux/reducer/authReducer";
import { checkUsernameThunk } from "../../redux/reducer/userReduce";

export default function EditProfileModal() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

  const usernameCheckResult = useSelector(
    (state) => state.user.usernameCheckResult
  );

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [preview, setPreview] = useState(user?.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);

  const handleClose = () => dispatch(closeEditProfileModal());

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Check username mỗi khi thay đổi
  useEffect(() => {
    if (!username) return;
    dispatch(checkUsernameThunk({ username, currentUserId: user._id }));
  }, [username, dispatch, user._id]);

  // Memo hóa logic kiểm tra hợp lệ của username
  const isUsernameInvalid = useMemo(() => {
    return usernameCheckResult?.exists && username !== user.username;
  }, [usernameCheckResult, username, user.username]);

  const handleSubmit = () => {
    if (isUsernameInvalid) return; // an toàn, đề phòng submit ngoài UI

    handleClose();

    const updateData = {
      fullName,
      username,
      email,
      bio,
      avatarUrl: user.avatarUrl,
    };

    const submitUpdate = (avatarUrl) => {
      if (avatarUrl) updateData.avatarUrl = avatarUrl;

      dispatch(updateUserThunk(updateData)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          const updatedUser = res.payload;
          dispatch(setAuthUser({ ...updatedUser, id: updatedUser._id }));
        }
      });
    };

    // Nếu có file ảnh mới thì upload
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        { method: "POST", body: formData }
      )
        .then((res) => res.json())
        .then((data) => {
          submitUpdate(data.secure_url);
        })
        .catch((err) => {
          console.error("Lỗi upload ảnh:", err);
        });
    } else {
      submitUpdate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg relative p-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-5 text-center">
          Cập nhật hồ sơ cá nhân
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <label className="relative group cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border">
                <User size={30} className="text-gray-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Camera size={22} className="text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Họ tên</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Nhập họ tên"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Nhập tên đăng nhập"
            />
            {isUsernameInvalid && (
              <div className="text-red-500 text-sm mt-1">
                Username đã tồn tại
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              value={email}
              className="w-full border px-3 py-2 rounded"
              placeholder="Nhập email"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Giới thiệu
            </label>
            <textarea
              rows={3}
              maxLength={100}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border px-3 py-2 rounded resize-none"
              placeholder="Nhập mô tả ngắn (tối đa 100 ký tự)"
            />
            <div className="text-sm text-gray-500 text-right">
              {bio.length}/100 ký tự
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUsernameInvalid}
            className={`px-4 py-2 rounded text-white ${
              isUsernameInvalid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

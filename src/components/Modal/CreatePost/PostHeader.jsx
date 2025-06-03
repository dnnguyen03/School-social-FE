import { ChevronDown, Globe, Users, Lock } from "lucide-react";
import { motion } from "framer-motion";

const PostHeader = ({
  user,
  privacy,
  setPrivacy,
  showDropdown,
  setShowDropdown,
}) => {
  const privacyOptions = [
    { label: "Công khai", value: "public", icon: <Globe size={16} /> },
    { label: "Riêng tư", value: "private", icon: <Lock size={16} /> },
  ];

  const selectedOption = privacyOptions.find((opt) => opt.value === privacy);
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b">
      <div className="flex items-start gap-3 mt-4">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <Users size={18} className="text-white" />
          </div>
        )}

        <div>
          <p className="font-semibold">{user.username}</p>
          <div className="relative mt-1 dropdown-container max-w-fit">
            <button
              type="button"
              className="flex items-center gap-2 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {selectedOption ? (
                <>
                  {selectedOption.icon}
                  {selectedOption.label}
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  Chọn quyền riêng tư
                </span>
              )}

              <ChevronDown size={16} />
            </button>

            {showDropdown && (
              <motion.div
                className="absolute z-10 mt-2 bg-white border rounded-md shadow w-44"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {privacyOptions.map((option) => (
                  <button
                    key={option.value}
                    className="w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      setPrivacy(option.value);
                      setShowDropdown(false);
                    }}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;

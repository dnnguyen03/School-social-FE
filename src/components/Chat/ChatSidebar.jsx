// src/components/Chat/ChatSidebar.jsx
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { openPopup } from "../../redux/reducer/chatPopupReducer";
import { fetchMutualsThunk } from "../../redux/reducer/userReduce";
import {
  selectMutuals,
  selectOnlineUsers,
} from "../../redux/selectors/userSelectors";
import { createOrGetConversation } from "../../services/chatService";
import { User } from "lucide-react";

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const mutuals = useSelector(selectMutuals);
  const onlineUsers = useSelector(selectOnlineUsers);
  const openPopups = useSelector((state) => state.chatPopup.openPopups);

  useEffect(() => {
    dispatch(fetchMutualsThunk());
  }, [dispatch]);

  const handleOpenChat = async (user) => {
    const conv = await createOrGetConversation(user._id);
    dispatch(
      openPopup({
        userId: user._id,
        userInfo: user,
        conversationId: conv._id,
      })
    );
  };

  return (
    <div className="w-64 border-l fixed right-0 top-0 h-full bg-white shadow-md px-4 py-2 z-10">
      <h3 className="text-lg font-semibold mb-2">Chat</h3>
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
        {mutuals.map((user) => {
          const isActive = openPopups.some((p) => p.userId === user._id);
          return (
            <div
              key={user._id}
              onClick={() => handleOpenChat(user)}
              className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-100 ${
                isActive ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative">
                <div className="relative w-10 h-10">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                  )}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      onlineUsers.includes(user._id)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>

                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
              </div>
              <span className="text-sm max-w-[120px] truncate">
                {user.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;

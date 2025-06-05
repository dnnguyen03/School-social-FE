// src/layouts/MainLayout.jsx
import Sidebar from "../components/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "../routers/router";
import CreatePostModal from "../components/Modal/CreatePost/CreatePostModal";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatPopupContainer from "../components/Chat/ChatPopupContainer";

import socket, { setGlobalReceiveMessageCallback } from "../utils/socket";
import { setOnlineUsers } from "../redux/reducer/userReduce";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { openPopup } from "../redux/reducer/chatPopupReducer";
import { getUser } from "../services/usreService";
import EditProfileModal from "../components/Modal/EditProfileModal";
import { loginSuccess } from "../redux/reducer/authReducer";

import {
  addNotificationRealtime,
  fetchNotificationsThunk,
} from "../redux/reducer/notificationReducer";

const MainLayout = () => {
  const dispatch = useDispatch();
  const openPopups = useSelector((state) => state.chatPopup.openPopups);
  const currentUser = useSelector((state) => state.auth.user);
  const showEditProfileModal = useSelector(
    (state) => state.modal.editProfileModal
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(loginSuccess({ user, token }));
      } catch (e) {
        console.error("Lỗi parse user từ localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    socket.emit("userOnline", currentUser.id);

    socket.on("updateOnlineUsers", (userIds) => {
      dispatch(setOnlineUsers(userIds));
    });

    socket.on("newNotification", (notification) => {
      dispatch(addNotificationRealtime(notification));
    });

    return () => {
      socket.off("updateOnlineUsers");
      socket.off("newNotification");
    };
  }, [currentUser?.id, dispatch]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchNotificationsThunk());
    }
  }, [currentUser?.id, dispatch]);

  useEffect(() => {
    if (!currentUser?.id) return;

    setGlobalReceiveMessageCallback(async (message) => {
      const { sender, conversationId, senderInfo } = message;
      if (!sender || sender._id === currentUser.id) return;

      const alreadyOpen = openPopups.some((p) => p.userId === sender._id);
      if (!alreadyOpen) {
        const userInfo = senderInfo || (await getUser(sender._id));
        dispatch(openPopup({ userId: sender._id, userInfo, conversationId }));
      }
    });

    if (!socket.connected) {
      socket.connect();
      socket.emit("userOnline", currentUser.id);
    }

    socket.on("updateOnlineUsers", (userIds) => {
      dispatch(setOnlineUsers(userIds));
    });

    return () => {
      socket.off("updateOnlineUsers");
    };
  }, [currentUser?.id, openPopups, dispatch]);

  const mainLayoutRoutes =
    routes.find((r) => r.layout === "MainLayout")?.pages || [];

  return (
    <div className="flex h-screen">
      <div className="w-20 h-screen fixed top-0 left-0">
        <Sidebar menuItems={mainLayoutRoutes} />
      </div>

      <div className="flex-1 overflow-auto bg-gray-100">
        <Routes>
          {mainLayoutRoutes.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
          ))}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>

      <CreatePostModal />
      <ChatSidebar />
      <ChatPopupContainer />
      {showEditProfileModal && <EditProfileModal />}
    </div>
  );
};

export default MainLayout;

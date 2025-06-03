import api from "./api";

export const getNotifications = async (lastSeenAt = "") => {
  const res = await api.get(`/notifications?lastSeenAt=${lastSeenAt}`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.post("/notifications/markAllAsRead");
  return res.data;
};

import api from "./api";

// Lấy lịch sử tin nhắn của conversation
export const getMessages = async (conversationId, before) => {
  const params = {};
  if (before) params.before = before;
  // limit mặc định 20
  const response = await api.get(`/chat/message/${conversationId}`, { params });
  return response.data;
};

export const createOrGetConversation = async (otherUserId) => {
  const res = await api.post("/chat/conversation", { otherUserId });
  return res.data;
};

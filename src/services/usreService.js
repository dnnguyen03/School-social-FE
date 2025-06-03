import api from "./api";

export const suggestUser = async (userData) => {
  const response = await api.get("/users/suggestions", userData);
  return response.data;
};

export const followUser = async (targetUserId) => {
  const response = await api.post(`/users/${targetUserId}/follow`);
  return response.data;
};
export const unfollowUser = async (targetUserId) => {
  const response = await api.post(`/users/${targetUserId}/unfollow`);
  return response.data;
};
export const searchUsers = async (keyword) => {
  const response = await api.get(`users/search?keyword=${keyword}`);
  return response.data.data;
};
export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};
export const getMutuals = async () => {
  const response = await api.get("/users/mutuals");
  return response.data;
};

export const updateUserProfile = async (userId, data) => {
  const res = await api.put(`/users/profile/${userId}`, data);
  return res.data;
};

export const fetchAllUsers = async (page = 1, limit = 10, role = "all") => {
  const response = await api.get(
    `/users?page=${page}&limit=${limit}&role=${role}`
  );
  return response.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};

export const restoreUser = async (userId) => {
  const res = await api.patch(`/users/${userId}/restore`);
  return res.data;
};

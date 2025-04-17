import api from "./api";

// Lấy danh sách bài viết
export const fetchPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

// Tạo bài viết mới
export const createPost = async (formData) => {
  const response = await api.post("/posts/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Xóa bài viết
export const deletePost = async (postId) => {
  await api.delete(`/posts/${postId}`);
  return postId;
};

// Like bài viết
export const likePost = async ({ postId, userId }) => {
  const response = await api.post("/posts/like", { postId, userId });
  return response.data;
};

// Bình luận bài viết
export const commentPost = async ({ postId, userId, content }) => {
  const response = await api.post("/posts/comment", {
    postId,
    userId,
    content,
  });
  return response.data;
};

// Đăng lại bài viết
export const repostPost = async ({ userId, postId }) => {
  const response = await api.post("/posts/repost", { userId, postId });
  return response.data;
};

// Báo cáo bài viết
export const reportPost = async ({ postId, userId, reason }) => {
  const response = await api.post("/posts/report", { postId, userId, reason });
  return response.data;
};

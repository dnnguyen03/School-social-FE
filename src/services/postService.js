import api from "./api";

// Lấy danh sách bài viết
export const fetchPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

export const getFollowingPosts = async (userId, lastCreatedAt = "") => {
  const url = lastCreatedAt
    ? `/posts/following/${userId}?lastCreatedAt=${lastCreatedAt}`
    : `/posts/following/${userId}`;
  const response = await api.get(url);
  return response.data;
};

export const fetchPublicPosts = async (lastCreatedAt = "") => {
  try {
    const url = lastCreatedAt
      ? `/posts/public?lastCreatedAt=${lastCreatedAt}`
      : `/posts/public`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching public posts:", error);
    throw error;
  }
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
  await api.delete(`/posts/delete/${postId}`);
  return postId;
};

// Like bài viết
export const likePost = async ({ postId }) => {
  const response = await api.post("/posts/like", { postId });
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

export const getReportedPosts = async () => {
  const res = await api.get("/posts/reported");
  return res.data;
};

export const hidePost = async (postId) => {
  const res = await api.put(`/posts/${postId}/report/hide`);
  return res.data;
};

export const ignoreReport = async (postId) => {
  const res = await api.put(`/posts/${postId}/report/ignore`);
  return res.data;
};

export const deleteReportedPost = async (postId) => {
  const res = await api.delete(`/posts/${postId}/report/delete`);
  return res.data;
};

export const unhidePost = async (postId) => {
  const res = await api.put(`/posts/${postId}/report/unhide`);
  return res.data;
};

export const getPostsByUserId = async (userId) => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};

//update post
export const editPost = async ({ postId, content, media, privacy }) => {
  const response = await api.put(`/posts/update/${postId}`, {
    content,
    media,
    privacy,
  });
  return response.data;
};

export const searchPosts = async (query, lastCreatedAt = "") => {
  const url = lastCreatedAt
    ? `/posts/search?query=${encodeURIComponent(
        query
      )}&lastCreatedAt=${lastCreatedAt}`
    : `/posts/search?query=${encodeURIComponent(query)}`;
  const response = await api.get(url);
  return response.data;
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPosts,
  createPost,
  deletePost,
  likePost,
  commentPost,
  repostPost,
  reportPost,
} from "../../services/postService";

// Thunk lấy danh sách bài viết
export const fetchPostsThunk = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    return await fetchPosts();
  }
);

// Thunk tạo bài viết mới
export const createPostThunk = createAsyncThunk(
  "posts/createPost",
  async (postData) => {
    const formData = new FormData();

    // Thêm nội dung bài viết vào formData
    formData.append("content", postData.content);

    // Thêm privacy vào formData (mặc định là public nếu không có)
    formData.append("privacy", postData.privacy || "public");

    // Kiểm tra và thêm các tệp media nếu có (media là mảng)
    if (Array.isArray(postData.media)) {
      postData.media.forEach((file) => {
        if (file.type === "image") {
          formData.append("image[]", file.url); // Thêm hình ảnh vào formData
        } else if (file.type === "video") {
          formData.append("video[]", file.url); // Thêm video vào formData
        }
      });
    }

    // Gọi createPost và truyền formData
    return await createPost(formData);
  }
);

// Thunk xóa bài viết
export const deletePostThunk = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    return await deletePost(postId);
  }
);

// Thunk like bài viết
export const likePostThunk = createAsyncThunk(
  "posts/likePost",
  async ({ postId, userId }) => {
    return await likePost({ postId, userId });
  }
);

// Thunk bình luận bài viết
export const commentPostThunk = createAsyncThunk(
  "posts/commentPost",
  async ({ postId, userId, content }) => {
    return await commentPost({ postId, userId, content });
  }
);

// Thunk đăng lại bài viết
export const repostPostThunk = createAsyncThunk(
  "posts/repostPost",
  async ({ userId, postId }) => {
    return await repostPost({ userId, postId });
  }
);

// Thunk báo cáo bài viết
export const reportPostThunk = createAsyncThunk(
  "posts/reportPost",
  async ({ postId, userId, reason }) => {
    return await reportPost({ postId, userId, reason });
  }
);

// Thêm một actionStatus cụ thể cho mỗi action
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
    actionStatus: {
      creating: false,
      deleting: false,
      liking: false,
      commenting: false,
      reposting: false,
      reporting: false,
    },
    reportMessage: null,
    createError: null, // Thêm error riêng cho từng action
    deleteError: null, // Thêm error riêng cho từng action
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPostsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPostsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Create post
      .addCase(createPostThunk.pending, (state) => {
        state.actionStatus.creating = true;
        state.createError = null; // Reset error when starting
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.actionStatus.creating = false;
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.actionStatus.creating = false;
        state.createError = action.error.message; // Error riêng cho action tạo bài viết
      })

      // Delete post
      .addCase(deletePostThunk.pending, (state) => {
        state.actionStatus.deleting = true;
        state.deleteError = null; // Reset error when starting
      })
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.actionStatus.deleting = false;
      })
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.actionStatus.deleting = false;
        state.deleteError = action.error.message; // Error riêng cho action xóa bài viết
      })

      // Like post
      .addCase(likePostThunk.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((id) => id !== userId); // Bỏ like
          } else {
            post.likes.push(userId); // Thêm like
          }
        }
      })
      .addCase(likePostThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Comment post
      .addCase(commentPostThunk.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
      })
      .addCase(commentPostThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Repost
      .addCase(repostPostThunk.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(repostPostThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Report post
      .addCase(reportPostThunk.pending, (state) => {
        state.actionStatus.reporting = true;
      })
      .addCase(reportPostThunk.fulfilled, (state, action) => {
        state.actionStatus.reporting = false;
        state.reportMessage = "Bài viết đã được báo cáo thành công.";
      })
      .addCase(reportPostThunk.rejected, (state, action) => {
        state.actionStatus.reporting = false;
        state.error = action.error.message;
      });
  },
});

export default postSlice.reducer;

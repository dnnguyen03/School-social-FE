import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPosts,
  createPost,
  deletePost,
  likePost,
  commentPost,
  repostPost,
  reportPost,
  fetchPublicPosts,
  editPost,
  getPostsByUserId,
  getFollowingPosts,
  getReportedPosts,
  hidePost,
  ignoreReport,
  deleteReportedPost,
  searchPosts,
} from "../../services/postService";

export const fetchPostsThunk = createAsyncThunk("posts/fetchPosts", fetchPosts);

export const updatePostThunk = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, content, media, privacy }) =>
    editPost({ postId, content, media, privacy })
);

export const fetchPublicPostsThunk = createAsyncThunk(
  "posts/fetchPublicPosts",
  async (lastCreatedAt) => fetchPublicPosts(lastCreatedAt)
);

export const fetchFollowingPostsThunk = createAsyncThunk(
  "posts/fetchFollowingPosts",
  async ({ userId, lastCreatedAt }) => getFollowingPosts(userId, lastCreatedAt)
);

export const searchPostsThunk = createAsyncThunk(
  "posts/searchPosts",
  async ({ query, lastCreatedAt }, { rejectWithValue }) => {
    try {
      return await searchPosts(query, lastCreatedAt);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Lỗi tìm kiếm bài viết"
      );
    }
  }
);

export const createPostThunk = createAsyncThunk(
  "posts/createPost",
  async (postData) => {
    const formData = new FormData();
    formData.append("content", postData.content);
    formData.append("privacy", postData.privacy || "public");

    if (Array.isArray(postData.media)) {
      postData.media.forEach((file) => {
        if (file.type === "image") formData.append("image[]", file.url);
        else if (file.type === "video") formData.append("video[]", file.url);
      });
    }

    return createPost(formData);
  }
);

export const deletePostThunk = createAsyncThunk("posts/deletePost", deletePost);
export const likePostThunk = createAsyncThunk("posts/likePost", likePost);
export const commentPostThunk = createAsyncThunk(
  "posts/commentPost",
  commentPost
);

export const repostPostThunk = createAsyncThunk("posts/repostPost", repostPost);

export const reportPostThunk = createAsyncThunk("posts/reportPost", reportPost);

export const fetchPostsByUserIdThunk = createAsyncThunk(
  "posts/fetchPostsByUserId",
  getPostsByUserId
);

export const getReportedPostsThunk = createAsyncThunk(
  "posts/getReportedPosts",
  getReportedPosts
);

export const hidePostThunk = createAsyncThunk(
  "posts/hidePost",
  async (postId) => hidePost(postId)
);

export const ignoreReportThunk = createAsyncThunk(
  "posts/ignoreReport",
  async (postId) => ignoreReport(postId)
);

export const deleteReportedPostThunk = createAsyncThunk(
  "posts/deleteReportedPost",
  async (postId) => deleteReportedPost(postId)
);

const initialState = {
  posts: [],
  searchedPosts: [],
  searchStatus: "idle",
  searchError: null,
  followingPosts: [],
  reportedPosts: [],
  userPosts: [],
  status: {
    forYou: "idle",
    following: "idle",
  },
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
  createError: null,
  deleteError: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicPostsThunk.pending, (state) => {
        state.status.forYou = "loading";
      })
      .addCase(fetchPublicPostsThunk.fulfilled, (state, action) => {
        state.status.forYou = "succeeded";
        if (!action.meta.arg) {
          state.posts = action.payload;
        } else {
          state.posts = [...state.posts, ...action.payload];
        }
      })
      .addCase(fetchPublicPostsThunk.rejected, (state, action) => {
        state.status.forYou = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchFollowingPostsThunk.pending, (state) => {
        state.status.following = "loading";
      })
      .addCase(fetchFollowingPostsThunk.fulfilled, (state, action) => {
        state.status.following = "succeeded";
        if (action.meta.arg?.lastCreatedAt) {
          state.followingPosts = [...state.followingPosts, ...action.payload];
        } else {
          state.followingPosts = action.payload;
        }
      })
      .addCase(fetchFollowingPostsThunk.rejected, (state, action) => {
        state.status.following = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchPostsByUserIdThunk.pending, (state) => {
        state.status.forYou = "loading";
      })
      .addCase(fetchPostsByUserIdThunk.fulfilled, (state, action) => {
        state.status.forYou = "succeeded";
        state.userPosts = action.payload;
      })
      .addCase(fetchPostsByUserIdThunk.rejected, (state, action) => {
        state.status.forYou = "failed";
        state.error = action.error.message;
      })

      .addCase(searchPostsThunk.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchPostsThunk.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        if (!action.meta.arg.lastCreatedAt) {
          state.searchedPosts = action.payload;
        } else {
          state.searchedPosts = [...state.searchedPosts, ...action.payload];
        }
      })
      .addCase(searchPostsThunk.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.searchError = action.payload;
      })

      .addCase(createPostThunk.pending, (state) => {
        state.actionStatus.creating = true;
        state.createError = null;
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.actionStatus.creating = false;
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.actionStatus.creating = false;
        state.createError = action.error.message;
      })

      .addCase(updatePostThunk.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== -1) state.posts[index] = updatedPost;
      })

      .addCase(deletePostThunk.pending, (state) => {
        state.actionStatus.deleting = true;
        state.deleteError = null;
      })
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.actionStatus.deleting = false;
      })
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.actionStatus.deleting = false;
        state.deleteError = action.error.message;
      })

      .addCase(likePostThunk.fulfilled, (state, action) => {
        const updated = action.payload;

        const idx1 = state.posts.findIndex((p) => p._id === updated._id);
        if (idx1 !== -1) state.posts[idx1] = updated;

        const idx2 = state.followingPosts.findIndex(
          (p) => p._id === updated._id
        );
        if (idx2 !== -1) state.followingPosts[idx2] = updated;

        const idx3 = state.searchedPosts.findIndex(
          (p) => p._id === updated._id
        );
        if (idx3 !== -1) state.searchedPosts[idx3] = updated;
      })

      .addCase(commentPostThunk.fulfilled, (state, action) => {
        const updatedPost = action.payload;

        const idx1 = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (idx1 !== -1) state.posts[idx1] = updatedPost;

        const idx2 = state.followingPosts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (idx2 !== -1) state.followingPosts[idx2] = updatedPost;

        const idx3 = state.searchedPosts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (idx3 !== -1) state.searchedPosts[idx3] = updatedPost;
      })

      .addCase(commentPostThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(repostPostThunk.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(repostPostThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getReportedPostsThunk.fulfilled, (state, action) => {
        const sorted = [...action.payload].sort((a, b) => {
          const lastA = Math.max(
            ...a.reports.map((r) => new Date(r.reportedAt))
          );
          const lastB = Math.max(
            ...b.reports.map((r) => new Date(r.reportedAt))
          );
          return lastB - lastA;
        });
        state.reportedPosts = sorted;
      })

      .addCase(hidePostThunk.fulfilled, (state, action) => {})
      .addCase(ignoreReportThunk.fulfilled, (state, action) => {})
      .addCase(deleteReportedPostThunk.fulfilled, (state, action) => {})

      .addCase(reportPostThunk.pending, (state) => {
        state.actionStatus.reporting = true;
      })
      .addCase(reportPostThunk.fulfilled, (state) => {
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

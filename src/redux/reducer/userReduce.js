// features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  suggestUser,
  followUser,
  unfollowUser,
  searchUsers,
  getUser,
  getMutuals,
  fetchAllUsers,
  updateUserProfile,
  deleteUser,
  restoreUser,
} from "../../services/usreService";

// Thunks
export const suggestUserThunk = createAsyncThunk(
  "user/suggestUser",
  async () => {
    return await suggestUser();
  }
);

export const followUserThunk = createAsyncThunk(
  "user/followUser",
  async (targetUserId) => {
    await followUser(targetUserId);
    return targetUserId;
  }
);

export const unfollowUserThunk = createAsyncThunk(
  "user/unfollowUser",
  async (targetUserId) => {
    await unfollowUser(targetUserId);
    return targetUserId;
  }
);

export const fetchMutualsThunk = createAsyncThunk(
  "user/fetchMutuals",
  async () => {
    return await getMutuals();
  }
);

export const searchUsersThunk = createAsyncThunk(
  "user/searchUsers",
  async (keyword) => {
    return await searchUsers(keyword);
  }
);
export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const userFromLocal = JSON.parse(localStorage.getItem("user"));
      if (!userFromLocal || !userFromLocal.id) {
        return rejectWithValue("Người dùng không hợp lệ");
      }

      const updated = await updateUserProfile(userFromLocal.id, data);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...updated, id: updated._id })
      );
      return updated;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Lỗi không xác định"
      );
    }
  }
);
export const updateUserByIdThunk = createAsyncThunk(
  "user/updateUserById",
  async ({ userId, data }) => {
    return await updateUserProfile(userId, data);
  }
);

export const getUserThunk = createAsyncThunk("user/getUser", async (userId) => {
  return await getUser(userId);
});

export const getAllUsersThunk = createAsyncThunk(
  "user/getAllUsers",
  async ({ page = 1, limit = 10, role = "all" }) => {
    return await fetchAllUsers(page, limit, role);
  }
);

export const deleteUserThunk = createAsyncThunk(
  "user/deleteUser",
  async (userId) => {
    const res = await deleteUser(userId);
    return res.user;
  }
);

export const lockUserThunk = createAsyncThunk(
  "user/lockUser",
  async (userId) => {
    const res = await api.patch(`/users/${userId}/lock`);
    return res.data.user;
  }
);

export const restoreUserThunk = createAsyncThunk(
  "user/restoreUser",
  async (userId) => {
    return await restoreUser(userId);
  }
);
// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    loadingIds: [],
    userDetails: null,
    followedUsers: [],
    suggestedUsers: [],
    searchResults: [],
    mutuals: [],
    onlineUsers: [],
    loading: false,
    error: null,

    adminUserList: [],
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Gợi ý người dùng
      .addCase(suggestUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(suggestUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestedUsers = action.payload;
      })
      .addCase(suggestUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(lockUserThunk.fulfilled, (state, action) => {
        const index = state.adminUserList.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.adminUserList[index] = action.payload;
      })

      .addCase(restoreUserThunk.fulfilled, (state, action) => {
        const index = state.adminUserList.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) state.adminUserList[index] = action.payload;
      })

      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.adminUserList = state.adminUserList.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(updateUserByIdThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.adminUserList.findIndex(
          (u) => u._id === updated._id
        );
        if (index !== -1) {
          state.adminUserList[index] = updated;
        }
      })

      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        const deletedId = action.payload;
        const index = state.adminUserList.findIndex((u) => u._id === deletedId);
        if (index !== -1) {
          state.adminUserList[index].isDeleted = true;
          state.adminUserList[index].deletedAt = new Date().toISOString();
        }
      })

      // Theo dõi người dùng
      .addCase(followUserThunk.fulfilled, (state, action) => {
        state.followedUsers.push(action.payload);
        state.suggestedUsers = state.suggestedUsers.map((user) =>
          user._id === action.payload ? { ...user, isFollowed: true } : user
        );
        state.searchResults = state.searchResults.map((user) =>
          user._id === action.payload ? { ...user, isFollowed: true } : user
        );
      })

      // Hủy theo dõi người dùng
      .addCase(unfollowUserThunk.fulfilled, (state, action) => {
        state.followedUsers = state.followedUsers.filter(
          (id) => id !== action.payload
        );
        state.suggestedUsers = state.suggestedUsers.map((user) =>
          user._id === action.payload ? { ...user, isFollowed: false } : user
        );
        state.searchResults = state.searchResults.map((user) =>
          user._id === action.payload ? { ...user, isFollowed: false } : user
        );
      })

      // Tìm kiếm người dùng
      .addCase(searchUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchMutualsThunk.fulfilled, (state, action) => {
        state.mutuals = action.payload;
      })

      // Lấy thông tin chi tiết người dùng
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.userDetails = action.payload;
      })

      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.adminUserList = action.payload.users;
        state.totalUsers = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      });
  },
});
export const { setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;

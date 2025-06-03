import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

export const fetchNotificationsThunk = createAsyncThunk(
  "notification/fetch",
  async (lastSeenAt = "") => {
    return await getNotifications(lastSeenAt);
  }
);

export const markAllAsReadThunk = createAsyncThunk(
  "notification/markAllAsRead",
  async () => {
    await markAllNotificationsAsRead();
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    hasMore: true,
    loading: false,
    error: null,
    unreadCount: 0,
    initialLoading: true,
  },
  reducers: {
    resetNotifications: (state) => {
      state.list = [];
      state.hasMore = true;
      state.loading = false;
      state.error = null;
      state.unreadCount = 0;
    },

    addNotificationRealtime: (state, action) => {
      const incoming = action.payload;
      const index = state.list.findIndex((n) => n._id === incoming._id);

      if (index !== -1) {
        state.list.splice(index, 1);
      }

      const isRead = incoming.isRead ?? false;

      state.list = [{ ...incoming, isRead }, ...state.list];

      if (!isRead) {
        state.unreadCount += 1;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(markAllAsReadThunk.fulfilled, (state) => {
        state.list = state.list.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      })
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.initialLoading = true;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.initialLoading = false;
        state.loading = false;
        if (action.payload.length < 10) state.hasMore = false;

        const newNotis = action.payload.filter(
          (n) => !state.list.some((existing) => existing._id === n._id)
        );

        state.list = [...state.list, ...newNotis];
        state.list.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        state.unreadCount = state.list.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addNotificationRealtime, resetNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;

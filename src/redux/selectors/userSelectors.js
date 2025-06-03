import { createSelector } from "@reduxjs/toolkit";

export const selectUserState = (state) => state.user;

export const selectMutuals = createSelector(
  [selectUserState],
  (user) => user.mutuals || []
);

export const selectOnlineUsers = createSelector(
  [selectUserState],
  (user) => user.onlineUsers || []
);

// src/redux/reducer/chatPopupReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openPopups: [], // mỗi phần tử: { userId, userInfo, conversationId }
};

const chatPopupSlice = createSlice({
  name: "chatPopup",
  initialState,
  reducers: {
    openPopup: (state, action) => {
      const { userId, conversationId } = action.payload;

      const exists = state.openPopups.find(
        (p) => p.userId === userId && p.conversationId === conversationId
      );

      if (!exists) {
        state.openPopups = state.openPopups.filter((p) => p.userId !== userId);

        if (state.openPopups.length >= 2) state.openPopups.shift();
        state.openPopups.push(action.payload);
      }
    },
    closePopup: (state, action) => {
      state.openPopups = state.openPopups.filter(
        (p) => p.userId !== action.payload
      );
    },
    closeAllPopups: (state) => {
      state.openPopups = [];
    },
  },
});

export const { openPopup, closePopup, closeAllPopups } = chatPopupSlice.actions;
export default chatPopupSlice.reducer;

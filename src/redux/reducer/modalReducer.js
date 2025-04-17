import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    createPostModal: false,
  },
  reducers: {
    openModal: (state) => {
      state.createPostModal = true;
    },
    closeModal: (state) => {
      state.createPostModal = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;

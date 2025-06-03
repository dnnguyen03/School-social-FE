import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    createPostModal: false,
    editPostData: null,
    editProfileModal: false,
  },
  reducers: {
    openModal: (state) => {
      state.createPostModal = true;
    },
    closeModal: (state) => {
      state.createPostModal = false;
      state.editPostData = null;
    },
    setEditPostData(state, action) {
      state.editPostData = action.payload;
      state.createPostModal = true;
    },

    //profile
    openEditProfileModal(state) {
      state.editProfileModal = true;
    },
    closeEditProfileModal(state) {
      state.editProfileModal = false;
    },
  },
});

export const {
  openModal,
  closeModal,
  setEditPostData,
  openEditProfileModal,
  closeEditProfileModal,
} = modalSlice.actions;
export default modalSlice.reducer;

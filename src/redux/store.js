import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./reducer/modalReducer";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
import userReducer from "./reducer/userReduce";
import chatPopupReducer from "./reducer/chatPopupReducer";
import notificationReducer from "./reducer/notificationReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    modal: modalReducer,
    posts: postReducer,
    chatPopup: chatPopupReducer,
    notification: notificationReducer,
  },
});

export default store;

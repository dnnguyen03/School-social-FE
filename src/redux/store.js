import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./reducer/modalReducer";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/authReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    posts: postReducer,
  },
});

export default store;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateUserProfile } from "../../services/usreService";

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",

  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const updated = await updateUserProfile(userId, data);
      return updated;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Cập nhật thất bại");
    }
  }
);
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    loginSuccess: (state, action) => {
      const user = {
        ...action.payload.user,
        id: action.payload.user._id,
      };
      state.user = user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      const updatedUser = {
        ...action.payload,
        id: action.payload._id,
      };
      state.user = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
    });
  },
});

export const { loginSuccess, logout, setAuthUser } = authSlice.actions;
export default authSlice.reducer;

import axios from "axios";
import { logout } from "../redux/reducer/authReducer";

const api = axios.create({
  baseURL: "https://school-social-be.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào mỗi request (nếu có)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;

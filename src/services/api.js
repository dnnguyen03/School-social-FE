import axios from "axios";

// Tạo một instance Axios với cấu hình mặc định
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào mỗi request (nếu có)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
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
      // Remove token từ localStorage và chuyển hướng đến trang đăng nhập
      localStorage.removeItem("token");
      // Chuyển hướng người dùng đến trang đăng nhập
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

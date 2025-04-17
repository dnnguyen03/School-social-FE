import api from "./api";

// Hàm đăng nhập
export const loginUser = async (userData) => {
  const response = await api.post("/users/login", userData);
  return response.data;
};

// Hàm đăng ký
export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

// Hàm đăng xuất
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

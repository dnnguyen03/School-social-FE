import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/reducer/authReducer";
import { getCurrentUser } from "../services/authService";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    const handleLogin = async () => {
      try {
        localStorage.setItem("token", token);
        const user = await getCurrentUser();
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(loginSuccess({ user, token }));
        navigate("/");
      } catch (err) {
        console.error("Lỗi khi lấy user sau đăng nhập Google:", err);
        navigate("/login");
      }
    };

    if (token) handleLogin();
    else navigate("/login");
  }, [dispatch, navigate]);

  return <p>Đang đăng nhập...</p>;
};

export default OAuthSuccess;

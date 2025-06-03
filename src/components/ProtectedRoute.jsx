import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { logout, loginSuccess } from "../redux/reducer/authReducer";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const reduxToken = useSelector((state) => state.auth.token);
  const [checking, setChecking] = useState(true);
  const [validUser, setValidUser] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const token = reduxToken || localStorage.getItem("token");
      if (!token) {
        setValidUser(false);
        setChecking(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        dispatch(loginSuccess({ user, token }));
        setValidUser(true);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logout());
        setValidUser(false);
      } finally {
        setChecking(false);
      }
    };

    verifyUser();
  }, [reduxToken, dispatch]);

  if (checking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
          <p className="text-gray-600 text-sm">Đang xác minh người dùng...</p>
        </motion.div>
      </div>
    );
  }

  return validUser ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;

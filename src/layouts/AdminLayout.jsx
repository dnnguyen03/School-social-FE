import AdminSidebar from "../components/Admin/AdminSidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "../routers/router";
import { useSelector } from "react-redux";
import UserEditModal from "../components/Modal/UserEditModal";

const AdminLayout = () => {
  const currentUser = useSelector((state) => state.auth.user);
  // Optional: Chặn người không phải admin
  if (!currentUser?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const adminRoutes =
    routes.find((r) => r.layout === "AdminLayout")?.pages || [];

  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        <Routes>
          {adminRoutes.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
          ))}
          <Route path="*" element={<Navigate to="/admin/users" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;

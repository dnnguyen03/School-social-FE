import { Home, LogOut, User } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "../../routers/router";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.user);

  const menu = routes.find((r) => r.layout === "AdminLayout")?.pages || [];

  const handleLogout = () => {
    // TODO: dispatch logout và redirect
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      {/* Admin info */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="w-10 h-10 max-h-none">
          {admin?.avatarUrl ? (
            <img
              src={admin?.avatarUrl}
              alt={admin?.avatarUrl}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold">{admin.fullName || "Admin"}</p>
          <p className="text-sm text-gray-400">{admin.username}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(`/admin${item.path}`)}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 rounded cursor-pointer"
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div
        onClick={() => navigate("/home")}
        className="mb-3 flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 rounded cursor-pointer text-gray-300"
      >
        <Home size={18} />
        <span>Về trang chính</span>
      </div>
      <div
        onClick={handleLogout}
        className="mt-auto flex items-center space-x-2 px-3 py-2 hover:bg-red-600 rounded cursor-pointer text-red-400"
      >
        <LogOut size={18} />
        <span>Đăng xuất</span>
      </div>
    </div>
  );
};

export default AdminSidebar;

import { Settings } from "lucide-react";
import { cloneElement, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../redux/reducer/modalReducer";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "../services/authService";
import { logout } from "../redux/reducer/authReducer";
import DarkModeModal from "./Modal/DarkModeModal";
import logo from "../assets/image/logoHUSC.png";

const Sidebar = ({ menuItems }) => {
  const [hovered, setHovered] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDarkModeModal, setShowDarkModeModal] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = currentUser?.isAdmin === true;
  const { unreadCount, initialLoading } = useSelector(
    (state) => state.notification
  );

  const handleLogout = () => {
    logoutUser();
    dispatch(logout());
    navigate("/auth/login");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        settingsButtonRef.current &&
        settingsButtonRef.current.contains(event.target)
      ) {
        setShowMenu((prev) => !prev);
      } else if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen w-20 bg-white border-r dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center py-4 space-y-6 justify-between relative">
      <div className="w-10 h-10">
        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
      </div>

      <nav className="flex flex-col items-center space-y-2 text-gray-400 dark:text-gray-300">
        {menuItems.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={
              name === "Profile" ? `/profile/${currentUser?.id}` : path || "#"
            }
            className={({ isActive }) =>
              `p-3 rounded-lg group transition relative ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
            onMouseEnter={() => setHovered(name)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => {
              if (name === "Create") {
                e.preventDefault();
                dispatch(openModal("createPost"));
              }
            }}
          >
            {({ isActive }) => (
              <>
                {cloneElement(icon, {
                  className: `w-8 h-8 transition ${
                    name === "Create"
                      ? hovered === "Create"
                        ? "text-black dark:text-white"
                        : "text-gray-400 dark:text-gray-300"
                      : isActive
                      ? "text-black dark:text-white"
                      : "text-gray-400 dark:text-gray-300"
                  }`,
                })}

                {name === "activity" && !initialLoading && unreadCount > 0 && (
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center space-y-6 text-gray-400 dark:text-gray-300">
        <div
          ref={settingsButtonRef}
          className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 group relative cursor-pointer"
        >
          <Settings className="w-8 h-8 text-gray-400 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition" />
        </div>
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-12 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-lg w-56 py-2 overflow-hidden"
          >
            {isAdmin && (
              <button
                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/admin/dashboard");
                }}
              >
                Trang quản trị
              </button>
            )}

            <button
              className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
              onClick={() => {
                setShowDarkModeModal(true);
                setShowMenu(false);
              }}
            >
              Giao diện
            </button>
            {["Thông tin chi tiết", "Cài đặt", "Báo cáo sự cố"].map(
              (text, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                >
                  {text}
                </button>
              )
            )}

            <hr className="border-gray-200 dark:border-gray-600" />
            <button
              className="block w-full text-left px-4 py-3 text-red-500 dark:text-red-400 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-700 dark:hover:text-red-300"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDarkModeModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-24 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg rounded-lg"
          >
            <DarkModeModal onClose={setShowDarkModeModal} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;

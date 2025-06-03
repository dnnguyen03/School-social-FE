import {
  Home,
  Search,
  PlusCircle,
  User,
  Bell,
  Users,
  FileText,
  BarChart,
  LayoutDashboardIcon,
  ShieldAlert,
} from "lucide-react";
import HomePage from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Notification from "../pages/Notification";
import Profile from "../pages/Profile";
import LoginForm from "../pages/auth/Login";
import RegisterForm from "../pages/auth/RegisterForm";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import AdminUsersPage from "../pages/Admin/AdminUsersPage";
import AdminPostsPage from "../pages/Admin/AdminPostsPage";
import AdminReportsPage from "../pages/Admin/AdminReportsPage";
import AdminStatsPage from "../pages/Admin/AdminStatsPage";

export const routes = [
  {
    layout: "MainLayout",
    pages: [
      { name: "Home", path: "/home", icon: <Home />, element: <HomePage /> },
      {
        name: "Search",
        path: "/search",
        icon: <Search />,
        element: <SearchPage />,
      },
      { name: "Create", path: null, icon: <PlusCircle />, element: null },
      {
        name: "activity",
        path: "/activity",
        icon: <Bell />,
        element: <Notification />,
      },
      {
        name: "Profile",
        path: "/profile/:id",
        icon: <User />,
        element: <Profile />,
      },
    ],
  },
  {
    layout: "AuthLayout",
    pages: [
      {
        name: "login",
        path: "/login",
        icon: null,
        element: <LoginForm />,
      },
      {
        name: "register",
        path: "/register",
        icon: null,
        element: <RegisterForm />,
      },
    ],
  },
  {
    layout: "AdminLayout",
    pages: [
      // {
      //   name: "Dashboard",
      //   label: "Dashboard",
      //   path: "/dashboard",
      //   icon: <LayoutDashboardIcon />,
      //   element: <AdminDashboardPage />,
      // },
      {
        name: "Users",
        label: "Người dùng",
        path: "/users",
        icon: <Users />,
        element: <AdminUsersPage />,
      },
      // {
      //   name: "Posts",
      //   label: "Bài viết",
      //   path: "/posts",
      //   icon: <FileText />,
      //   element: <AdminPostsPage />,
      // },
      {
        name: "Reports",
        label: "Báo cáo",
        path: "/reports",
        icon: <ShieldAlert />,
        element: <AdminReportsPage />,
      },
      // {
      //   name: "Stats",
      //   label: "Thống kê",
      //   path: "/stats",
      //   icon: <BarChart />,
      //   element: <AdminStatsPage />,
      // },
    ],
  },
];

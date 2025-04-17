import {
  Home,
  Search,
  PlusCircle,
  Heart,
  User,
  Shield,
  Settings,
  LayoutDashboard,
  Bell,
} from "lucide-react";
import HomePage from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Notification from "../pages/Notification";
import Profile from "../pages/Profile";
import LoginForm from "../pages/auth/Login";
import RegisterForm from "../pages/auth/RegisterForm";

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
        path: "/profile",
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
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard />,
        element: null,
      },
      { name: "Users", path: "/users", icon: <User />, element: null },
      {
        name: "Settings",
        path: "/settings",
        icon: <Settings />,
        element: null,
      },
      { name: "Security", path: "/security", icon: <Shield />, element: null },
    ],
  },
];

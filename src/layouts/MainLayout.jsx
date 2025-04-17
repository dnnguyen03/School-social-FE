import { useState } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "../routers/router";
import CreatePostModal from "../components/Modal/CreatePostModal";

const MainLayout = () => {
  const mainLayoutRoutes =
    routes.find((r) => r.layout === "MainLayout")?.pages || [];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-20 h-screen fixed top-0 left-0">
        <Sidebar menuItems={mainLayoutRoutes} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "MainLayout" &&
              pages.map(({ path, element }, index) => (
                <Route exact key={index} path={path} element={element} />
              ))
          )}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
      <CreatePostModal />
    </div>
  );
};

export default MainLayout;

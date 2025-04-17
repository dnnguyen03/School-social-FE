import { Routes, Route } from "react-router-dom";
import { routes } from "../routers/router";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        {routes
          .find((r) => r.layout === "AuthLayout")
          ?.pages.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
      </Routes>
    </div>
  );
};

export default AuthLayout;

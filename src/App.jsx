import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Auth layout */}
          <Route
            path="/auth/*"
            element={token ? <Navigate to="/home" replace /> : <AuthLayout />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/*" element={<MainLayout />} />
          </Route>

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;

import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

export default function ProtectedRoute({ role }) {
  const { token, user } = useAuth();
  const context = useOutletContext(); // ← ambil context dari MainLayout

  if (!token) return <Navigate to="/login" />;

  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet context={context} />; // ← teruskan ke children (Home, dll)
}
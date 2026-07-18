import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/entities/user/model/useAuth";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;

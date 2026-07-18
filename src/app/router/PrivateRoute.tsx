import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/entities/user/model/useAuth";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

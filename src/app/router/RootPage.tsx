import { Navigate } from "react-router";
import { useAuth } from "@/entities/user/model/useAuth";
import LandingPage from "@/pages/landing/LandingPage";

const RootPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/collections" replace />;
  }

  return <LandingPage />;
};

export default RootPage;

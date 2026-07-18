import { Routes, Route } from "react-router";
import RootPage from "./RootPage";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "@/pages/login/LoginPage";
import RegisterPage from "@/pages/register/RegisterPage";
import CollectionsPage from "@/pages/collections/CollectionsPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootPage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/collections" element={<CollectionsPage />} />
      </Route>

      <Route path="*" element={<RootPage />} />
    </Routes>
  );
};

export default AppRouter;

import { Routes, Route } from "react-router";
import RootPage from "./RootPage";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import CollectionsPage from "@/pages/collections";
import AppLayout from "@/app/layouts/AppLayout";
import SetPage from "@/pages/set";
import NewObjectPage from "@/pages/object/NewObjectPage";
import EditObjectPage from "@/pages/edit-object/EditObjectPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootPage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route
          path="/collections"
          element={
            <AppLayout>
              <CollectionsPage />
            </AppLayout>
          }
        />
        <Route
          path="/collections/:setId"
          element={
            <AppLayout>
              <SetPage />
            </AppLayout>
          }
        />
        <Route
          path="/collections/:setId/objects/new"
          element={
            <AppLayout>
              <NewObjectPage />
            </AppLayout>
          }
        />
        <Route
          path="/collections/:setId/objects/:objectId/edit"
          element={
            <AppLayout>
              <EditObjectPage />
            </AppLayout>
          }
        />
      </Route>

      <Route path="*" element={<RootPage />} />
    </Routes>
  );
};

export default AppRouter;

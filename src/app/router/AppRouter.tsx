import { Routes, Route } from "react-router";
import RootPage from "./RootPage";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import CollectionsPage from "@/pages/collections";
import AppLayout from "@/app/layouts/AppLayout";
import SetPage from "@/pages/set";
import NewObjectPage from "@/pages/object";
import EditObjectPage from "@/pages/edit-object";
import EditSetPage from "@/pages/edit-set";
import PublicSetPage from "@/pages/public/PublicSetPage";
import ProfilePage from "@/pages/profile";
import CardsPage from "@/pages/cards";
import TestPage from "@/pages/test";
import ExamPage from "@/pages/exam";
import ImportTablePage from "@/pages/import-table";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootPage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/s/:shareId" element={<PublicSetPage />} />

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
        <Route
          path="/collections/:setId/edit"
          element={
            <AppLayout>
              <EditSetPage />
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />
        <Route
          path="/collections/:setId/cards"
          element={
            <AppLayout>
              <CardsPage />
            </AppLayout>
          }
        />
        <Route
          path="/collections/:setId/test"
          element={
            <AppLayout>
              <TestPage />
            </AppLayout>
          }
        />
        <Route
          path="/collections/:setId/exam"
          element={
            <AppLayout>
              <ExamPage />
            </AppLayout>
          }
        />
        <Route
          path="/collections/:setId/import/table"
          element={
            <AppLayout>
              <ImportTablePage />
            </AppLayout>
          }
        />
      </Route>

      <Route path="*" element={<RootPage />} />
    </Routes>
  );
};

export default AppRouter;

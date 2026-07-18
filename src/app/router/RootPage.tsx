import { useAuth } from "@/entities/user/model/useAuth";
import LandingPage from "@/pages/landing/LandingPage";
import CollectionsPage from "@/pages/collections/CollectionsPage";

const RootPage = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <CollectionsPage /> : <LandingPage />;
};

export default RootPage;

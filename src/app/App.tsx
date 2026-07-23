import { BrowserRouter } from "react-router";
import { AuthProvider } from "@/entities/user/model/AuthContext";
import { ToastProvider } from "./providers/ToastProvider";
import { useAuth } from "@/entities/user/model/useAuth";
import AppRouter from "@/app/router/AppRouter";

const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40vh" }}>Загрузка...</div>
    );
  }

  return <AppRouter />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

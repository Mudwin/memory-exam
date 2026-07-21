import { BrowserRouter } from "react-router";
import { AuthProvider } from "@/entities/user/model/AuthContext";
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
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

import { BrowserRouter } from "react-router";
import { AuthProvider } from "@/entities/user/model/AuthContext";
import AppRouter from "@/app/router/AppRouter";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

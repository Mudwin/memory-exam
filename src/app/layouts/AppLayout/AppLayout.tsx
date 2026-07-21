import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/entities/user/model/useAuth";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/collections" className={styles.logo}>
            MemoryExam
          </Link>
          <div className={styles.userSection}>
            <span className={styles.email}>{user?.email}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default AppLayout;

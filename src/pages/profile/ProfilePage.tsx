import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/entities/user/model/useAuth";
import { useSets } from "@/entities/set/model/useSets";
import { useToastContext } from "@/app/providers/ToastProvider";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sets } = useSets();
  const { showSuccess, showError } = useToastContext();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      showError("Новый пароль должен быть не менее 8 символов");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Пароли не совпадают");
      return;
    }

    setIsChanging(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("Пароль успешно изменён (заглушка)");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showError("Не удалось изменить пароль");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Профиль</h1>

      <div className={styles.card}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Личная информация</h2>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{user?.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Количество наборов</span>
            <span className={styles.value}>{sets.length}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Изменить пароль</h2>
          <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
            <div className={styles.field}>
              <label htmlFor="oldPassword" className={styles.label}>
                Старый пароль
              </label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Введите старый пароль"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="newPassword" className={styles.label}>
                Новый пароль
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Повторите новый пароль
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.actions}>
              <Button buttonType="save" type="submit" disabled={isChanging}>
                Сохранить пароль
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

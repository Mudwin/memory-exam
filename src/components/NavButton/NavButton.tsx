import styles from "./NavButton.module.css";

type NavButtonState = "open" | "closed";

interface NavButtonProps {
  children: React.ReactNode;
  iconSrc: string;
  state: NavButtonState;
  page: string;
  onClick?: () => void;
}

const NavButton = ({
  children,
  iconSrc,
  state,
  page,
  onClick,
}: NavButtonProps) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {state === "open" ? (
        <span>{children}</span>
      ) : (
        <img src={iconSrc} alt={page} />
      )}
    </button>
  );
};

export default NavButton;

import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

interface NavbarProps {
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

function Navbar({ onLogout, isDarkMode, onToggleTheme }: NavbarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    onLogout();

    navigate("/login");
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link className={styles.logo} to="/feed">
            Clone Twitter
          </Link>

          <div className={styles.links}>
            <Link className={styles.link} to="/feed">
              Feed
            </Link>

            <Link className={styles.link} to="/profile">
              Meu perfil
            </Link>

            <Link className={styles.link} to="/followers">
              Seguidores
            </Link>

            <button
              className={styles.themeButton}
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"
              }
              title={isDarkMode ? "Modo claro" : "Modo escuro"}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            <button
              className={styles.logoutButton}
              type="button"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <nav className={styles.mobileNav}>
        <Link className={styles.mobileLink} to="/feed">
          <span>🏠</span>
          <span>Feed</span>
        </Link>

        <Link className={styles.mobileLink} to="/profile">
          <span>👤</span>
          <span>Perfil</span>
        </Link>

        <Link className={styles.mobileLink} to="/followers">
          <span>👥</span>
          <span>Seguidores</span>
        </Link>
      </nav>
    </>
  );
}

export default Navbar;

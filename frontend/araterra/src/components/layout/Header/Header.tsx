import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, MapPinned, Moon, Sun } from "lucide-react";
import { useToggleTheme } from "../../../hooks/useToggleTheme";
import * as authService from "../../../services/authService";
import styles from "./Header.module.css";
import MenuProfile from "../../utils/MenuProfile";

export function Header() {
  const { theme, toggleTheme } = useToggleTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<authService.UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    if (authService.isAuthenticated()) {
      authService
        .fetchProfile()
        .then((profile) => mounted && setUser(profile))
        .catch(() => setUser(null));
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.brand} aria-label="Araterra">
          <Leaf aria-hidden="true" />
          <span>Araterra</span>
        </Link>

        <div className={styles.context}>
          <span>
            <MapPinned aria-hidden="true" />
            Mapa operacional
          </span>
          <p>Análise territorial com camadas, clima e infraestrutura.</p>
        </div>

        <nav className={styles.actions} aria-label="Navegação do mapa">
          <button
            type="button"
            className={styles.themeButton}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/" className={styles.secondaryLink}>
            Home
          </Link>
          {user ? (
            <MenuProfile user={user} onLogout={handleLogout} />
          ) : (
            <Link to="/login" className={styles.primaryLink}>
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";
import { Leaf, MapPinned, Moon, Sun } from "lucide-react";
import { useToggleTheme } from "../../../hooks/useToggleTheme";
import styles from "./Header.module.css";

export function Header() {
  const { theme, toggleTheme } = useToggleTheme();

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
          <Link to="/login" className={styles.primaryLink}>
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}

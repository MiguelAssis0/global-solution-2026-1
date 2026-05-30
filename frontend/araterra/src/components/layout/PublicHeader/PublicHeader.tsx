import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Menu, Moon, Sun, X } from "lucide-react";
import MenuProfile from "../../utils/MenuProfile";
import type { UserProfile } from "../../../services/authService";
import styles from "./PublicHeader.module.css";

export type PublicNavItem = {
  label: string;
  href: string;
};

type PublicHeaderProps = {
  variant?: "transparent" | "solid";
  scrolled?: boolean;
  navItems: PublicNavItem[];
  showHomeAction?: boolean;
  showThemeToggle?: boolean;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  user?: UserProfile | null;
  onLogout?: () => void;
};

export function PublicHeader({
  variant = "solid",
  scrolled = false,
  navItems,
  showHomeAction = false,
  showThemeToggle = false,
  theme = "dark",
  onToggleTheme,
  user = null,
  onLogout,
}: PublicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isTransparent = variant === "transparent";

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const renderNavLink = (item: PublicNavItem, className?: string) => {
    const closeMenu = () => setIsMenuOpen(false);

    if (item.href.startsWith("/")) {
      return (
        <Link to={item.href} className={className} onClick={closeMenu}>
          {item.label}
        </Link>
      );
    }

    return (
      <a href={item.href} className={className} onClick={closeMenu}>
        {item.label}
      </a>
    );
  };

  const authAction = user ? (
    <MenuProfile user={user} onLogout={onLogout ?? (() => undefined)} />
  ) : (
    <Link to="/login" className={styles.primaryButton}>
      Entrar
    </Link>
  );

  const mobileAuthAction = user ? (
    <>
      <Link
        to="/profile"
        className={styles.mobilePrimary}
        onClick={() => setIsMenuOpen(false)}
      >
        Meu perfil
      </Link>
      <button
        type="button"
        className={styles.mobileGhostButton}
        onClick={() => {
          setIsMenuOpen(false);
          onLogout?.();
        }}
      >
        Sair
      </button>
    </>
  ) : (
    <Link
      to="/login"
      className={styles.mobilePrimary}
      onClick={() => setIsMenuOpen(false)}
    >
      Entrar
    </Link>
  );

  return (
    <header
      className={[
        styles.header,
        isTransparent ? styles.transparent : styles.solid,
        scrolled ? styles.scrolled : "",
        isMenuOpen ? styles.menuOpen : "",
      ].join(" ")}
    >
      <div className={styles.inner}>
        <Link
          to="/"
          className={styles.brand}
          aria-label="Araterra"
          onClick={() => setIsMenuOpen(false)}
        >
          <Leaf aria-hidden="true" />
          <span>Araterra</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          {navItems.map((item) => (
            <span key={`${item.href}-${item.label}`}>
              {renderNavLink(item)}
            </span>
          ))}
        </nav>

        <div className={styles.actions}>
          {showThemeToggle && (
            <button
              type="button"
              className={styles.themeButton}
              onClick={onToggleTheme}
              aria-label={
                theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          {showHomeAction && (
            <Link to="/" className={styles.outlineButton}>
              Home
            </Link>
          )}

          <Link to="/map" className={styles.outlineButton}>
            Abrir mapa
          </Link>

          {authAction}
        </div>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobilePanel}>
          <nav className={styles.mobileNav} aria-label="Navegação mobile">
            {navItems.map((item) => (
              <span key={`${item.href}-${item.label}-mobile`}>
                {renderNavLink(item)}
              </span>
            ))}
          </nav>

          <div className={styles.mobileActions}>
            {showThemeToggle && (
              <button
                type="button"
                className={styles.mobileGhostButton}
                onClick={onToggleTheme}
              >
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </button>
            )}

            {showHomeAction && (
              <Link
                to="/"
                className={styles.mobileGhostLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            )}

            <Link
              to="/map"
              className={styles.mobileGhostLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Abrir mapa
            </Link>

            {mobileAuthAction}
          </div>
        </div>
      )}
    </header>
  );
}

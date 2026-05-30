import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import * as authService from "../../services/authService";
import styles from "../layout/Header/Header.module.css";

export default function MenuProfile({ user, onLogout }: { user: authService.UserProfile; onLogout: () => void }) {
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setMenuOpen(false);
          }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      }, [menuRef]);

    const handleLogout = () => {
        onLogout();
        navigate("/login", { replace: true });
    }
    return(
         <div className={styles.profileMenu} ref={menuRef}>
              <button
                type="button"
                className={styles.profileButton}
                onClick={() => setMenuOpen((current) => !current)}
                aria-label="Abrir menu de usuário"
              >
                {user.avatarPath ? (
                  <img
                    src={user.avatarPath}
                    alt={`${user.firstName} ${user.lastName}`}
                    className={styles.avatar}
                  />
                ) : (
                  <UserCircle2 size={20} />
                )}
              </button>

              {menuOpen && (
                <div className={styles.profileDropdown} role="menu">
                  <button
                    type="button"
                    className={styles.profileDropdownItem}
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                  >
                    Meu perfil
                  </button>
                  <button
                    type="button"
                    className={styles.profileDropdownItem}
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
    )
}
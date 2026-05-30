import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, ShieldCheck } from "lucide-react";
import styles from "./CookieConsent.module.css";

const STORAGE_KEY = "araterra-cookie-consent-v1";

type ConsentLevel = "all" | "necessary";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      setIsVisible(!localStorage.getItem(STORAGE_KEY));
    } catch {
      setIsVisible(false);
    }
  }, []);

  const saveConsent = (level: ConsentLevel) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          level,
          acceptedAt: new Date().toISOString(),
        }),
      );
    } finally {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      className={styles.banner}
      aria-label="Aviso de cookies e privacidade"
    >
      <div className={styles.iconWrap}>
        <Cookie aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <h2>Cookies e privacidade</h2>
        <p>
          Usamos cookies necessários para manter segurança, sessão e preferências
          do site. Cookies adicionais só serão usados quando forem informados de
          forma clara.
        </p>

        <Link to="/privacidade" className={styles.privacyLink}>
          <ShieldCheck aria-hidden="true" />
          Ver Política de Privacidade
        </Link>

        <div className={styles.actions}>
          <button type="button" onClick={() => saveConsent("necessary")}>
            Somente necessários
          </button>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => saveConsent("all")}
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </aside>
  );
}

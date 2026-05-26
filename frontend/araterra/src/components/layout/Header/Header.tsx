import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.brand}>GeoAptidão</p>
        <p className={styles.subtitle}>Análise territorial geoespacial com dados de satélite, clima e infra.</p>
      </div>
      <div className={styles.tag}>MVP de inteligência territorial</div>
    </header>
  );
}

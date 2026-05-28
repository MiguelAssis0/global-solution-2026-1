import { Link } from "react-router-dom";
import { Home, Leaf, MapPinned } from "lucide-react";
import styles from "./NotFound.module.css";

export function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="not-found-title">
        <Link to="/" className={styles.brand} aria-label="Araterra">
          <Leaf aria-hidden="true" />
          <span>Araterra</span>
        </Link>

        <p className={styles.kicker}>Página não encontrada</p>
        <h1 id="not-found-title">Esse caminho não existe no mapa.</h1>
        <p className={styles.text}>
          A rota acessada não está disponível. Volte para a página inicial ou
          abra diretamente o ambiente de análise territorial.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryLink}>
            <Home aria-hidden="true" />
            Página inicial
          </Link>
          <Link to="/map" className={styles.secondaryLink}>
            <MapPinned aria-hidden="true" />
            Abrir mapa
          </Link>
        </div>
      </section>

      <aside className={styles.preview} aria-hidden="true">
        <div className={styles.panelHeader}>
          <span>Área não localizada</span>
          <strong>404</strong>
        </div>
        <div className={styles.panelMap}>
          <span className={styles.areaOne} />
          <span className={styles.areaTwo} />
          <span className={styles.areaThree} />
        </div>
        <div className={styles.panelRows}>
          <span>Revise o endereço digitado</span>
          <span>Retorne para uma rota válida</span>
          <span>Continue a análise pelo mapa</span>
        </div>
      </aside>
    </main>
  );
}

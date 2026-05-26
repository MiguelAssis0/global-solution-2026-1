import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "#08110f", color: "#d8eedd" }}>
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Página não encontrada</h1>
        <p style={{ marginBottom: "1.5rem", color: "#a3b89f" }}>
          O caminho não existe. Volte para a análise territorial principal.
        </p>
        <Link to="/" style={{ color: "var(--color-accent)", fontWeight: 700 }}>
          Ir para GeoAptidão
        </Link>
      </div>
    </main>
  );
}

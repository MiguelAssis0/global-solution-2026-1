interface EmptyStateProps {
  loading: boolean;
}

export function EmptyState({ loading }: EmptyStateProps) {
  return (
    <section
      style={{
        padding: 22,
        borderRadius: 8,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.14)",
        textAlign: "center",
      }}
    >
      {loading ? (
        <p style={{ margin: 0, color: "var(--color-text-2)" }}>Preparando análise...</p>
      ) : (
        <>
          <h2 style={{ margin: "0 0 12px", color: "var(--color-text)", fontSize: "1.2rem", lineHeight: 1.25 }}>
            Selecione um ponto ou desenhe um polígono
          </h2>
          <p style={{ margin: 0, color: "var(--color-text-2)", lineHeight: 1.6, fontSize: "0.94rem" }}>
            Clique no mapa para iniciar uma análise territorial. Use o painel de
            camadas para ativar satélite, NDVI, estradas e energia.
          </p>
        </>
      )}
    </section>
  );
}

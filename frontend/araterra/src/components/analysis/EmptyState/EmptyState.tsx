interface EmptyStateProps {
  loading: boolean;
}

export function EmptyState({ loading }: EmptyStateProps) {
  return (
    <section style={{ padding: 24, borderRadius: 24, background: "rgba(255,255,255,0.04)", textAlign: "center" }}>
      {loading ? (
        <p style={{ color: "var(--color-text-2)" }}>Preparando análise...</p>
      ) : (
        <>
          <h2 style={{ marginBottom: 12, color: "var(--color-text)" }}>Selecione um ponto ou desenhe um polígono</h2>
          <p style={{ color: "var(--color-text-2)", lineHeight: 1.6 }}>
            Clique no mapa para iniciar uma análise territorial. Use o painel de camadas para ativar Satélite, NDVI, Estradas e Energia.
          </p>
        </>
      )}
    </section>
  );
}

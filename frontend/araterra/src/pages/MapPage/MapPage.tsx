import { useMemo } from "react";
import styles from "./MapPage.module.css";
import { Header } from "../../components/layout/Header/Header";
import { Toolbar } from "../../components/layout/Toolbar/Toolbar";
import { Sidebar } from "../../components/layout/Sidebar/Sidebar";
import { MapSurface } from "../../components/map/MapContainer/MapContainer";
import { useMapBounds } from "../../hooks/useMapBounds";
import { useAnalysis } from "../../hooks/useAnalysis";
import { useOsmData } from "../../hooks/useOsmData";
import { useWeather } from "../../hooks/useWeather";
import { useMapStore } from "../../store/mapStore";
import { useAiInsight } from "../../hooks/useAiInsight";

export function MapPage() {
  const { handleBoundsChange } = useMapBounds();
  const { current, isLoading, error, runPointAnalysis, runPolygonAnalysis } = useAnalysis();
  const { insight, loading: insightLoading, error: insightError, requestInsight } = useAiInsight();
  const bounds = useMapStore((state) => state.bounds);
  const drawMode = useMapStore((state) => state.drawMode);
  const activeLayers = useMapStore((state) => state.activeLayers);

  const weatherTarget = useMemo(() => {
    if (!current) return { lat: null, lng: null };
    if (current.type === "point") return { lat: current.lat, lng: current.lng };
    return { lat: current.centroidLat, lng: current.centroidLng };
  }, [current]);

  const weather = useWeather(weatherTarget.lat, weatherTarget.lng);
  const osm = useOsmData(bounds);

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.content}>
        <div className={styles.mapPanel}>
          <Toolbar activeLayers={activeLayers} drawMode={drawMode} />
          <MapSurface
            drawMode={drawMode}
            onBoundsChange={handleBoundsChange}
            onPointSelect={runPointAnalysis}
            onPolygonComplete={runPolygonAnalysis}
            roads={osm.roads}
            infrastructure={osm.infrastructure}
            areas={osm.areas}
          />
        </div>
        <aside className={styles.sidebarPanel}>
          <Sidebar
            analysis={current}
            loading={isLoading}
            error={error}
            weather={weather.data}
            weatherLoading={weather.isLoading}
            weatherError={weather.error?.message ?? null}
            insight={insight}
            insightLoading={insightLoading}
            insightError={insightError}
            onGenerateInsight={requestInsight}
          />
        </aside>
      </div>
    </div>
  );
}

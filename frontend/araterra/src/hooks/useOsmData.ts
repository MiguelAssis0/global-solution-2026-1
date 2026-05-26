import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchInfrastructure, fetchRoads, fetchAgriculturalAreas } from "../services/osmService";
import type { MapBounds } from "../types/map.types";

export function useOsmData(bounds: MapBounds | null) {
  const queryKey = useMemo(() => (bounds ? ["osm", bounds.south, bounds.west, bounds.north, bounds.east] : ["osm", "empty"]), [bounds]);

  const roadsQuery = useQuery({
    queryKey: [...queryKey, "roads"],
    queryFn: fetchRoads,
    enabled: bounds !== null,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const infrastructureQuery = useQuery({
    queryKey: [...queryKey, "infrastructure"],
    queryFn: fetchInfrastructure,
    enabled: bounds !== null,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const areasQuery = useQuery({
    queryKey: [...queryKey, "areas"],
    queryFn: fetchAgriculturalAreas,
    enabled: bounds !== null,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    roads: roadsQuery.data ?? null,
    infrastructure: infrastructureQuery.data ?? null,
    areas: areasQuery.data ?? null,
    roadsLoading: roadsQuery.isLoading,
    infraLoading: infrastructureQuery.isLoading,
    areasLoading: areasQuery.isLoading,
  };
}

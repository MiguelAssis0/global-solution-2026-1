import { useQuery } from "@tanstack/react-query";
import type { WeatherData } from "../types/analysis.types";
import { fetchWeather } from "../services/weatherService";

export function useWeather(lat: number | null, lng: number | null) {
  return useQuery<WeatherData, Error>({
    queryKey: ["weather", lat, lng],
    queryFn: () => fetchWeather(lat!, lng!),
    enabled: lat !== null && lng !== null,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}

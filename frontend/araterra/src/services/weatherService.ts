import { api } from "./api";
import type { WeatherData } from "../types/analysis.types";

export const fetchWeather = (lat: number, lng: number): Promise<WeatherData> =>
  api.get<WeatherData>("/geo/weather", { params: { lat, lng } }).then((r) => r.data);

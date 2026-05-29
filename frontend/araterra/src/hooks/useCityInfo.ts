import { useEffect, useState } from "react";
import { getCityFromCoordinates, type CityInfo } from "../services/nominatimService";

interface UseCityInfoOptions {
  lat?: number;
  lng?: number;
  enabled?: boolean;
}

export function useCityInfo({ lat, lng, enabled = true }: UseCityInfoOptions) {
  const [cityInfo, setCityInfo] = useState<CityInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || lat === undefined || lng === undefined) {
      setCityInfo(null);
      setError(null);
      return;
    }

    let active = true;

    const fetchCity = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const city = await getCityFromCoordinates(lat, lng);

        if (active) {
          if (city) {
            setCityInfo(city);
          } else {
            setError("Unable to fetch city information");
          }
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchCity();

    return () => {
      active = false;
    };
  }, [lat, lng, enabled]);

  return { cityInfo, isLoading, error };
}

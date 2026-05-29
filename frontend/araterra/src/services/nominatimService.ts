export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_id: number;
  osm_type: string;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: string[];
}

export interface CityInfo {
  name: string;
  cityName: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Realiza reverse geocoding usando a API pública do Nominatim
 * Retorna informações sobre a localização mais próxima de um ponto lat/lng
 */
export const reverseGeocode = async (
  lat: number,
  lng: number,
): Promise<NominatimResult | null> => {
  try {
    const params = new URLSearchParams({
      format: "json",
      lat: lat.toString(),
      lon: lng.toString(),
      zoom: "18",
      addressdetails: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "AraterraApp/1.0",
        },
      },
    );

    if (!response.ok) {
      console.error("Nominatim error:", response.statusText);
      return null;
    }

    return (await response.json()) as NominatimResult;
  } catch (error) {
    console.error("Error calling Nominatim reverse geocoding:", error);
    return null;
  }
};

export const extractCityInfo = (result: NominatimResult): CityInfo | null => {
  if (!result.address) {
    return null;
  }

  const address = result.address;
  const cityName =
    address.city || address.town || address.village || address.municipality || "Unknown";
  const state = address.state || address.county || "Unknown";
  const country = address.country || "Unknown";

  return {
    name: result.name || cityName,
    cityName,
    state,
    country,
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    displayName: result.display_name,
  };
};

/**
 * Busca informações de cidade para um ponto lat/lng usando Nominatim
 */
export const getCityFromCoordinates = async (
  lat: number,
  lng: number,
): Promise<CityInfo | null> => {
  const result = await reverseGeocode(lat, lng);
  if (!result) {
    return null;
  }

  return extractCityInfo(result);
};

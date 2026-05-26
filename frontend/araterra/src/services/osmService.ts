import { api } from "./api";

export const fetchRoads = () => api.get("/spatial/roads").then((r) => r.data);

export const fetchInfrastructure = () => api.get("/spatial/infrastructure").then((r) => r.data);

export const fetchAgriculturalAreas = () => api.get("/spatial/agricultural-areas").then((r) => r.data);

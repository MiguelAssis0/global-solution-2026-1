import { api } from "./api";

export const fetchHistory = (page = 0, size = 10) =>
  api.get(`/analysis/history`, { params: { page, size } }).then((r) => r.data);

export const fetchAnalysisById = (id: string) =>
  api.get(`/analysis/history/${id}`).then((r) => r.data);

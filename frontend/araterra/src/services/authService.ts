import { api } from "./api";

const TOKEN_KEY = "araterra_token";
const REFRESH_TOKEN_KEY = "araterra_refresh_token";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  requiresTwoFactor?: boolean;
};

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const saveRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const isAuthenticated = () => Boolean(getToken());

export const login = async (data: LoginPayload) => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  const token = response.data.accessToken ?? response.data.token;

  if (token) {
    saveToken(token);
  }

  if (response.data.refreshToken) {
    saveRefreshToken(response.data.refreshToken);
  }

  return response.data;
};

export const register = async (data: RegisterPayload) => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  const token = response.data.accessToken ?? response.data.token;

  if (token) {
    saveToken(token);
  }

  if (response.data.refreshToken) {
    saveRefreshToken(response.data.refreshToken);
  }

  return response.data;
};

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

export type ThemePreference = "light" | "dark" | "system";

export type UserThemeResponse = {
  theme: ThemePreference;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarPath?: string;
  theme?: ThemePreference;
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

export const fetchUserTheme = async (): Promise<UserThemeResponse> => {
  const response = await api.get<UserThemeResponse>("/auth/user-theme");
  return response.data;
};

export const updateUserTheme = async (
  theme: ThemePreference,
): Promise<UserThemeResponse> => {
  const response = await api.patch<UserThemeResponse>("/auth/user-theme", {
    theme,
  });
  return response.data;
};

export const fetchProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/auth/me");
  return response.data;
};

export const updateProfile = async (
  profile: Partial<Pick<UserProfile, "firstName" | "lastName" | "phone" | "avatarPath">>,
): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>("/auth/me", profile);
  return response.data;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (
  data: ChangePasswordPayload,
): Promise<void> => {
  await api.patch("/auth/me/password", data);
};

export const uploadAvatar = async (file: File) => {

  const formData = new FormData();
  formData.append("file", file);

  const response = await api.patch(
    "/auth/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
import { useCallback, useEffect, useState } from "react";
import * as authService from "../services/authService";

type ThemePreference = "dark" | "light" | "system";
const STORAGE_KEY = "araterra_theme";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

const getStoredTheme = (): ThemePreference | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : null;
};

const resolveTheme = (theme: ThemePreference): "dark" | "light" =>
  theme === "system" ? getSystemTheme() : theme;

const applyTheme = (theme: ThemePreference) => {
  document.documentElement.dataset.theme = resolveTheme(theme);
};

export function useToggleTheme() {
  const [theme, setTheme] = useState<ThemePreference>(
    getStoredTheme() ?? "system",
  );

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      return;
    }

    let active = true;

    authService
      .fetchUserTheme()
      .then((data) => {
        if (active && data?.theme) {
          setTheme(data.theme);
        }
      })
      .catch(() => {
        // Ignore theme sync failures and keep local preference.
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const resolved = resolveTheme(current);
      const nextTheme: ThemePreference =
        current === "dark"
          ? "light"
          : current === "light"
          ? "dark"
          : resolved === "dark"
          ? "light"
          : "dark";

      if (authService.isAuthenticated()) {
        authService.updateUserTheme(nextTheme).catch(() => {
          // Fail silently if theme save does not succeed.
        });
      }

      return nextTheme;
    });
  }, []);

  return { theme: resolveTheme(theme), toggleTheme };
}

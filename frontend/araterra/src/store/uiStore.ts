import { create } from "zustand";

interface UiStore {
  drawerOpen: boolean;
  snackbarMessage: string | null;
  setDrawerOpen: (open: boolean) => void;
  showSnackbar: (message: string | null) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  drawerOpen: false,
  snackbarMessage: null,
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  showSnackbar: (message) => set({ snackbarMessage: message }),
}));

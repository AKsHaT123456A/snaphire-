import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserRole } from "../types";

interface AuthState {
  token: string | null;
  userId: string | null;
  role: UserRole | null;
  profileComplete: boolean;
  isLoading: boolean;
  setAuth: (token: string, userId: string, role: UserRole, profileComplete: boolean) => void;
  setProfileComplete: (v: boolean) => void;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  role: null,
  profileComplete: false,
  isLoading: true,

  setAuth: async (token, userId, role, profileComplete) => {
    await AsyncStorage.setItem("auth", JSON.stringify({ token, userId, role, profileComplete }));
    set({ token, userId, role, profileComplete });
  },

  setProfileComplete: (v) => set({ profileComplete: v }),

  logout: async () => {
    await AsyncStorage.removeItem("auth");
    set({ token: null, userId: null, role: null, profileComplete: false });
  },

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem("auth");
      if (raw) {
        const { token, userId, role, profileComplete } = JSON.parse(raw);
        set({ token, userId, role, profileComplete });
      }
    } catch {}
    set({ isLoading: false });
  },
}));

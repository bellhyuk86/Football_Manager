import { create } from "zustand";
import api from "@/lib/api";
import type { AuthState } from "@/types";

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      set({ token: data.token, user: data.user, loading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.error || "로그인에 실패했습니다.",
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  setError: (error) => set({ error }),

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    })),

  hydrate: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token });
      try {
        const { data } = await api.get("/users/me");
        set({ user: data });
      } catch {
        localStorage.removeItem("token");
        set({ token: null, user: null });
      }
    }
  },
}));

export default useAuthStore;

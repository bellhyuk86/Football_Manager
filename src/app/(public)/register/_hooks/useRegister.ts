import { useState } from "react";
import api from "@/lib/api";
import useAuthStore from "@/stores/useAuthStore";
import type { Role, RegisterPayload, RegisterResult } from "@/types";

export type { Role };

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegisterResult | null>(null);

  const register = async (payload: RegisterPayload) => {
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", payload);

      localStorage.setItem("token", data.token);
      useAuthStore.getState().hydrate();

      setResult({
        inviteCode: data.team?.inviteCode,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return { loading, error, result, register, resetError };
}

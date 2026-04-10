import { useState } from "react";
import api from "@/lib/api";
import type { PlayerPayload } from "@/types";

export function useCreatePlayer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlayer = async (
    payload: PlayerPayload
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/players", payload);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "선수 등록에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return { loading, error, createPlayer, resetError };
}

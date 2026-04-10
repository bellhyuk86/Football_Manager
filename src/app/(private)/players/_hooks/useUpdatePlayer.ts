import { useState } from "react";
import api from "@/lib/api";
import type { PlayerPayload } from "@/types";

export function useUpdatePlayer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePlayer = async (
    id: string,
    payload: PlayerPayload
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/players/${id}`, payload);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "선수 수정에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return { loading, error, updatePlayer, resetError };
}

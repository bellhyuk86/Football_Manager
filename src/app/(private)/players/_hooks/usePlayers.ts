import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { Player, Position } from "@/types";

export type { Player, Position };

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState<Position | null>(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = positionFilter ? { position: positionFilter } : {};
      const { data } = await api.get("/players", { params });
      setPlayers(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "선수 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [positionFilter]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const deletePlayer = async (id: string) => {
    try {
      await api.delete(`/players/${id}`);
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "선수 삭제에 실패했습니다.");
    }
  };

  return {
    players,
    loading,
    error,
    positionFilter,
    setPositionFilter,
    deletePlayer,
    refetch: fetchPlayers,
  };
}

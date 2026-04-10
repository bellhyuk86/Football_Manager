import { useState, useEffect } from "react";
import api from "@/lib/api";
import type { Formation } from "@/types";

export type { Formation };

export function useFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/formations");
        setFormations(data);
      } catch (err: any) {
        setError(
          err.response?.data?.error || "포메이션 목록을 불러올 수 없습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { formations, loading, error };
}

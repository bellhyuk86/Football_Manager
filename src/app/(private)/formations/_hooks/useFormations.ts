"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { FormationDetail } from "@/types";

export function useFormations() {
  const [formations, setFormations] = useState<FormationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<FormationDetail | null>(null);

  const fetchFormations = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/formations");
      setFormations(data);
    } catch {
      toast.error("포메이션 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/formations/${deleteTarget.id}`);
      toast.success("포메이션이 삭제되었습니다.");
      setFormations((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    } catch {
      toast.error("포메이션 삭제에 실패했습니다.");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  return {
    formations,
    loading,
    deleteTarget,
    setDeleteTarget,
    handleDelete,
  };
}

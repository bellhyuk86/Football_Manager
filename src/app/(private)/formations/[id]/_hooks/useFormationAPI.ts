import { useState } from "react";
import api from "@/lib/api";
import type { FormationDetail, FormationPayload } from "@/types";

export function useFormationAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFormation = async (id: string): Promise<FormationDetail | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/formations/${id}`);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error || "포메이션을 불러올 수 없습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveFormation = async (
    payload: FormationPayload,
    id?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await api.patch(`/formations/${id}`, payload);
      } else {
        await api.post("/formations", payload);
      }
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "포메이션 저장에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFormation = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/formations/${id}`);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "포메이션 삭제에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, loadFormation, saveFormation, deleteFormation };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type {
  FormationTemplate,
  FormationTemplatePayload,
} from "../_types";

export function useFormationTemplates() {
  const [templates, setTemplates] = useState<FormationTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/formation-templates");
      setTemplates(data);
    } catch {
      toast.error("템플릿 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = useCallback(
    async (payload: FormationTemplatePayload) => {
      try {
        const { data } = await api.post("/formation-templates", payload);
        setTemplates((prev) => [...prev, data]);
        toast.success("템플릿이 생성되었습니다.");
        return true;
      } catch {
        toast.error("템플릿 생성에 실패했습니다.");
        return false;
      }
    },
    []
  );

  const updateTemplate = useCallback(
    async (id: string, payload: FormationTemplatePayload) => {
      try {
        const { data } = await api.patch(`/formation-templates/${id}`, payload);
        setTemplates((prev) => prev.map((t) => (t.id === id ? data : t)));
        toast.success("템플릿이 수정되었습니다.");
        return true;
      } catch {
        toast.error("템플릿 수정에 실패했습니다.");
        return false;
      }
    },
    []
  );

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      await api.delete(`/formation-templates/${id}`);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("템플릿이 삭제되었습니다.");
      return true;
    } catch {
      toast.error("템플릿 삭제에 실패했습니다.");
      return false;
    }
  }, []);

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}

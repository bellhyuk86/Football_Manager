"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export interface TeamMember {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "manager" | "coach" | "player";
  profileImage: string | null;
}

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/team-members");
      setMembers(data);
    } catch {
      toast.error("팀원 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const changeRole = useCallback(
    async (userId: string, role: "manager" | "coach" | "player") => {
      try {
        await api.patch(`/users/${userId}/role`, { role });
        toast.success("권한이 변경되었습니다.");
        await fetchMembers();
        return true;
      } catch (err: any) {
        toast.error(err.response?.data?.error || "권한 변경에 실패했습니다.");
        return false;
      }
    },
    [fetchMembers]
  );

  return { members, loading, changeRole };
}

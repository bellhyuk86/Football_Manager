"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import useAuthStore from "@/stores/useAuthStore";
import type { Player } from "@/types";

interface MyProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  profileImage: string | null;
  team: { id: string; name: string } | null;
}

interface TeamInfo {
  id: string;
  name: string;
}

export function useMyPage() {
  const updateAuthUser = useAuthStore((s) => s.updateUser);
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/users/me");
      setProfile(data);
    } catch {
      toast.error("프로필을 불러올 수 없습니다.");
    }
  }, []);

  const fetchMyPlayer = useCallback(async () => {
    try {
      const { data } = await api.get("/players/me");
      setMyPlayer(data);
    } catch {
      /* silent — player may not exist */
    }
  }, []);

  const fetchInviteCode = useCallback(async () => {
    try {
      const { data } = await api.get("/teams/me/invite-code");
      setInviteCode(data.inviteCode);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchProfile();
      await fetchMyPlayer();
      setLoading(false);
    })();
  }, [fetchProfile, fetchMyPlayer]);

  const updateProfile = useCallback(
    async (payload: { name?: string; email?: string; profileImage?: string | null }) => {
      try {
        const { data } = await api.patch("/users/me", payload);
        setProfile((prev) => (prev ? { ...prev, ...data } : prev));
        updateAuthUser(data);
        toast.success("프로필이 수정되었습니다.");
        return true;
      } catch (err: any) {
        toast.error(err.response?.data?.error || "프로필 수정에 실패했습니다.");
        return false;
      }
    },
    []
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        await api.patch("/users/me/password", { currentPassword, newPassword });
        toast.success("비밀번호가 변경되었습니다.");
        return true;
      } catch (err: any) {
        toast.error(err.response?.data?.error || "비밀번호 변경에 실패했습니다.");
        return false;
      }
    },
    []
  );

  const updateTeamName = useCallback(async (name: string) => {
    try {
      await api.patch("/teams/me", { name });
      setProfile((prev) =>
        prev ? { ...prev, team: prev.team ? { ...prev.team, name } : null } : prev
      );
      toast.success("팀명이 수정되었습니다.");
      return true;
    } catch {
      toast.error("팀명 수정에 실패했습니다.");
      return false;
    }
  }, []);

  const regenerateInviteCode = useCallback(async () => {
    try {
      const { data } = await api.patch("/teams/me/invite-code");
      setInviteCode(data.inviteCode);
      toast.success("초대코드가 재발급되었습니다.");
    } catch {
      toast.error("초대코드 재발급에 실패했습니다.");
    }
  }, []);

  const uploadProfileImage = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      const { data } = await api.post("/users/me/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
      updateAuthUser({ profileImage: data.profileImage });
      toast.success("프로필 이미지가 변경되었습니다.");
      return true;
    } catch {
      toast.error("프로필 이미지 업로드에 실패했습니다.");
      return false;
    }
  }, []);

  const deleteProfileImage = useCallback(async () => {
    try {
      const { data } = await api.delete("/users/me/profile-image");
      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
      updateAuthUser({ profileImage: null });
      toast.success("프로필 이미지가 삭제되었습니다.");
      return true;
    } catch {
      toast.error("프로필 이미지 삭제에 실패했습니다.");
      return false;
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      await api.delete("/users/me");
      toast.success("회원 탈퇴가 완료되었습니다.");
      return true;
    } catch {
      toast.error("회원 탈퇴에 실패했습니다.");
      return false;
    }
  }, []);

  return {
    profile,
    myPlayer,
    inviteCode,
    loading,
    fetchInviteCode,
    updateProfile,
    changePassword,
    uploadProfileImage,
    deleteProfileImage,
    updateTeamName,
    regenerateInviteCode,
    deleteAccount,
  };
}

import { useState } from "react";
import api from "@/lib/api";

export function useFindPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const findPassword = async (username: string, email: string) => {
    setError(null);
    setSent(false);
    setLoading(true);

    try {
      await api.post("/auth/find-password", { username, email });
      setSent(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "비밀번호 찾기에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSent(false);
    setError(null);
  };

  return { sent, error, loading, findPassword, reset };
}

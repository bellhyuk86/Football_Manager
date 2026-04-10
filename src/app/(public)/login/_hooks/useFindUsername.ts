import { useState } from "react";
import api from "@/lib/api";

export function useFindUsername() {
  const [maskedUsername, setMaskedUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const findUsername = async (name: string, email: string) => {
    setError(null);
    setMaskedUsername(null);
    setLoading(true);

    try {
      const { data } = await api.post("/auth/find-username", { name, email });
      setMaskedUsername(data.username);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "아이디 찾기에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMaskedUsername(null);
    setError(null);
  };

  return { maskedUsername, error, loading, findUsername, reset };
}

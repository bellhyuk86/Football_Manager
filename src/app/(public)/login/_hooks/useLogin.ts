import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";

const REMEMBER_KEY = "remembered_username";

export function useLogin() {
  const router = useRouter();
  const { loading, error, login: authLogin } = useAuthStore();
  const [rememberedUsername, setRememberedUsername] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) setRememberedUsername(saved);
  }, []);

  const login = async (
    username: string,
    password: string,
    rememberMe: boolean
  ) => {
    const success = await authLogin(username, password);

    if (success) {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, username);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      router.push("/players");
    }
  };

  return { error, loading, rememberedUsername, login };
}

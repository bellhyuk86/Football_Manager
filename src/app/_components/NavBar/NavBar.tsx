"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import styles from "./NavBar.module.scss";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:4000";

export default function NavBar() {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const isLoggedIn = !!token;
  const avatarUrl = user?.profileImage ? `${API_BASE}${user.profileImage}` : null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className={styles.nav}>
      {isLoggedIn ? (
        <>
          {/* Left: Logo */}
          <Link href="/players" className={styles.logo}>
            Football Manager
          </Link>

          {/* Right: Profile + Logout */}
          <div className={styles.privateRight}>
            <div className={styles.profileWrapper}>
              <span className={styles.profileName}>
                {user?.name || "User"}
              </span>
              <div className={styles.profileAvatar}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || "Profile"}
                    className={styles.profileAvatarImg}
                  />
                ) : (
                  <span className="material-symbols-outlined">person</span>
                )}
              </div>
              {/* Hover Dropdown */}
              <div className={styles.profileDropdown}>
                <Link href="/mypage" className={styles.dropdownItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                    account_circle
                  </span>
                  My Page
                </Link>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <Link href="/" className={styles.logo}>
            Football Manager
          </Link>
          <div className={styles.publicActions}>
            <Link href="/login" className={styles.loginBtn}>
              Login
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}

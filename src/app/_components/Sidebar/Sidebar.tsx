"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  { href: "/players", icon: "groups", label: "Players" },
  { href: "/formations", icon: "architecture", label: "Formations" },
  { href: "/schedules", icon: "calendar_today", label: "Schedules" },
];

const MANAGER_NAV_ITEMS = [
  { href: "/users", icon: "admin_panel_settings", label: "Users" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);
  const isManager = role === "manager";

  const allItems = isManager ? [...NAV_ITEMS, ...MANAGER_NAV_ITEMS] : NAV_ITEMS;

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brandSection}>
        <div className={styles.brandIcon}>
          <span
            className={`material-symbols-outlined ${styles.brandIconInner}`}
          >
            analytics
          </span>
        </div>
        <div className={styles.brandInfo}>
          <span className={styles.brandTitle}>Football Manager</span>
          <span className={styles.brandSub}>Elite Analytics</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navList}>
        {allItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${
              pathname === item.href ? styles.navItemActive : ""
            }`}
          >
            <span
              className={`material-symbols-outlined ${styles.navItemIcon}`}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

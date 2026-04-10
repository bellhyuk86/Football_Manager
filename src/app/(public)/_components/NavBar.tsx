import Link from "next/link";
import styles from "./NavBar.module.scss";

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>Football Manager</div>

      <div className={styles.actions}>
        <Link href="/login" className={styles.loginBtn}>
          Login
        </Link>
      </div>
    </nav>
  );
}

import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <div className={styles.brandName}>Tactify FC</div>
        <div className={styles.brandCopy}>
          © 2024 Tactify FC. The Analytical Engine.
        </div>
      </div>

      <div className={styles.links}>
        <a href="#" className={styles.link}>
          개인정보 처리방침
        </a>
        <a href="#" className={styles.link}>
          이용약관
        </a>
        <a href="#" className={styles.link}>
          고객 지원
        </a>
        <a href="#" className={styles.link}>
          Tactical API
        </a>
      </div>

      <div className={styles.socials}>
        <button className={styles.socialBtn}>
          <span className={`material-symbols-outlined ${styles.icon}`}>
            share
          </span>
        </button>
        <button className={styles.socialBtn}>
          <span className={`material-symbols-outlined ${styles.icon}`}>
            database
          </span>
        </button>
      </div>
    </footer>
  );
}

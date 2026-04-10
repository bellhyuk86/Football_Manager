"use client";

import { useState } from "react";
import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import FindIdModal from "./_components/FindIdModal";
import FindPasswordModal from "./_components/FindPasswordModal";
import styles from "./login.module.scss";

export default function LoginPage() {
  const [findIdOpen, setFindIdOpen] = useState(false);
  const [findPwOpen, setFindPwOpen] = useState(false);

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.bgOverlay}>
        <div className={styles.bgBlobPrimary} />
        <div className={styles.bgBlobSecondary} />
        <div className={styles.bgImage} />
      </div>

      {/* Main */}
      <main className={styles.main}>
        {/* Login Card */}
        <div className={styles.card}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerRow}>
              {/*<span*/}
              {/*  className={`material-symbols-outlined ${styles.headerIcon}`}*/}
              {/*>*/}
              {/*  strategy*/}
              {/*</span>*/}
              <h1 className={styles.headerTitle}>Football Manager</h1>
            </div>
            <p className={styles.headerSub}>Elite Management Portal</p>
          </header>

          <LoginForm />

          {/* Footer Links */}
          <nav className={styles.footerNav}>
            <button
              className={styles.footerLink}
              onClick={() => setFindIdOpen(true)}
            >
              아이디 찾기
            </button>
            <span className={styles.footerDivider} />
            <button
              className={styles.footerLink}
              onClick={() => setFindPwOpen(true)}
            >
              비밀번호 찾기
            </button>
            <span className={styles.footerDivider} />
            <Link href="/register" className={styles.footerLink}>
              회원가입
            </Link>
          </nav>
        </div>

        {/* Decorative Footer */}
        <div className={styles.decoFooter}>
          <div className={styles.decoTag}>
            <span
              className={`material-symbols-outlined ${styles.decoTagIcon}`}
            >
              sports_soccer
            </span>
            <span className={styles.decoTagText}>
              Currently scouting: 12,402 Elite Players Worldwide
            </span>
          </div>
        </div>
      </main>

      {/* Modals */}
      <FindIdModal isOpen={findIdOpen} onClose={() => setFindIdOpen(false)} />
      <FindPasswordModal
        isOpen={findPwOpen}
        onClose={() => setFindPwOpen(false)}
      />
    </div>
  );
}

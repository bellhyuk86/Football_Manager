"use client";

import { useState } from "react";
import Link from "next/link";
import RegisterForm from "./_components/RegisterForm";
import RegisterSuccessModal from "./_components/RegisterSuccessModal";
import { useRegister } from "./_hooks/useRegister";
import type { Role } from "@/types";
import styles from "./register.module.scss";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("manager");
  const { loading, error, result, register, resetError } = useRegister();

  const handleRoleChange = (newRole: Role) => {
    resetError();
    setRole(newRole);
  };

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.bgOverlay}>
        <div className={styles.bgBlobPrimary} />
        <div className={styles.bgBlobSecondary} />
      </div>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.card}>
          {/* Header */}
          <header className={styles.header}>
            <h1 className={styles.headerTitle}>Create Account</h1>
            <p className={styles.headerSub}>
              당신의 전술적 역량을 증명하십시오.
            </p>
          </header>

          <RegisterForm
            role={role}
            onRoleChange={handleRoleChange}
            onSubmit={register}
            loading={loading}
            serverError={error}
          />

          {/* Footer */}
          <p className={styles.footer}>
            Already have an account?
            <Link href="/login" className={styles.footerLink}>
              Log In
            </Link>
          </p>
        </div>
      </main>

      {/* Success Modal */}
      <RegisterSuccessModal
        isOpen={!!result}
        inviteCode={result?.inviteCode}
      />
    </div>
  );
}

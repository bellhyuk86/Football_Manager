import Link from "next/link";
import styles from "./CTASection.module.scss";

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.glass}>
        <div className={styles.accentBar} />
        <h2 className={styles.title}>리그에 참여하세요</h2>
        <p className={styles.desc}>
          당신의 스쿼드를 전술적 파워하우스로 바꿀 준비가 되셨나요? 지금 바로
          팀을 만들고 시작하세요.
        </p>
        <div className={styles.actions}>
          <Link href="/register" className={styles.ctaBtn}>
            팀 만들기
          </Link>
        </div>
        <p className={styles.footerText}>
          Limited Access Beta &bull; Analytical Engine Version 2.0
        </p>
      </div>
    </section>
  );
}

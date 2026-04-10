import Link from "next/link";
import styles from "./HeroSection.module.scss";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background */}
      <div className={styles.bgWrapper}>
        <div className={styles.bgGradient} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnsVs8totd_WBd-6CvRraNzOq8V8axmYK54jIWjjmpCHywfrZFRMeTynBmsvbqK3oy7ysIF7_DFTVkOyG4ILdokfGOXwD3GTUcSgxdktfUcVcCisTvNPQs5ZbRuHzkjHk2L_C9-sSymd_crHGIfMHKhQN9Ot7KjUCZwQuaZWA9ElKkkC3b0MPwgg3qCE9qbG9hys5DuvbIT-oblRQcLYZoySi_c0omDU9fBhYursV-GN_xKPISiOqseUpPSYSciv3n37RhZCUUkpM"
          alt="Top view soccer pitch"
          className={styles.bgImage}
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <span className={styles.badge}>The Analytical Engine 2.0</span>
        <h1 className={styles.title}>
          클럽 축구 매니지먼트의 <br />
          <span className={styles.titleAccent}>REVOLUTIONIZING</span> <br />
          혁신
        </h1>
        <p className={styles.description}>
          엘리트 전술 시각화, 정밀한 선수 데이터, 그리고 완벽한 팀 동기화를 통해
          코칭 스태프의 역량을 강화하세요.
        </p>
        <div className={styles.buttons}>
          <Link href="/login" className={styles.primaryBtn}>
            시작하기
          </Link>
        </div>
      </div>

      <div className={styles.bottomFade} />
    </section>
  );
}

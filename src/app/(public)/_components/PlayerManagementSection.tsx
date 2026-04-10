import styles from "./PlayerManagementSection.module.scss";

const RADAR_LABELS = ["SPD", "STA", "PAS", "SHT", "DEF", "PHY"];
const SAMPLE_DATA = [0.85, 0.94, 0.88, 0.72, 0.6, 0.78];

function hexagonPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");
}

function dataPoints(
  cx: number,
  cy: number,
  maxR: number,
  values: number[]
): string {
  return values
    .map((val, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const r = maxR * val;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");
}

export default function PlayerManagementSection() {
  return (
    <section id="features" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.sectionTitle}>스쿼드를 마스터하세요</h2>
          <div className={styles.titleBar} />
        </div>
        <p className={styles.headerLabel}>데이터 중심의 퍼포먼스 쉘</p>
      </div>

      {/* Bento Grid */}
      <div className={styles.grid}>
        {/* 1. Position Filters */}
        <div className={`${styles.card} ${styles.positionCard}`}>
          <div>
            <span className={`material-symbols-outlined ${styles.cardIcon}`}>
              filter_list
            </span>
            <h3 className={styles.cardTitle}>포지션 필터</h3>
            <p className={styles.cardDesc}>
              전술 구역 및 전문 역할별로 로스터를 즉시 분류하세요.
            </p>
          </div>
          <div className={styles.filterTags}>
            <span className={styles.tagActive}>GK</span>
            <span className={styles.tag}>DEF</span>
            <span className={styles.tag}>MID</span>
            <span className={styles.tag}>FWD</span>
          </div>
        </div>

        {/* 2. Data Radar */}
        <div className={`${styles.card} ${styles.radarCard}`}>
          <div className={styles.radarContent}>
            <span className={`material-symbols-outlined ${styles.cardIcon}`}>
              query_stats
            </span>
            <h3 className={styles.radarTitle}>DATA RADAR</h3>
            <p className={styles.cardDesc}>
              정밀 설계된 레이더 차트를 통해 신체 및 기술적 결과물을
              시각화하세요.
            </p>
            <div className={styles.radarStats}>
              <div className={styles.statBox}>
                <p className={styles.statLabel}>STAMINA</p>
                <p className={styles.statValue}>94.2%</p>
              </div>
              <div className={styles.statBoxSecondary}>
                <p className={styles.statLabel}>PASSING</p>
                <p className={styles.statValueDefault}>88.5%</p>
              </div>
            </div>
          </div>
          <div className={styles.radarVisual}>
            <svg
              viewBox="0 0 200 200"
              className={styles.radarSvg}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid hexagons (3 levels) */}
              {[1, 0.66, 0.33].map((scale) => (
                <polygon
                  key={scale}
                  points={hexagonPoints(100, 100, 80 * scale)}
                  fill="none"
                  stroke="rgba(135,148,140,0.15)"
                  strokeWidth="1"
                />
              ))}
              {/* Axis lines */}
              {RADAR_LABELS.map((_, i) => {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const x = 100 + 80 * Math.cos(angle);
                const y = 100 + 80 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={x}
                    y2={y}
                    stroke="rgba(135,148,140,0.15)"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Data polygon */}
              <polygon
                points={dataPoints(100, 100, 80, SAMPLE_DATA)}
                fill="rgba(104,219,174,0.15)"
                stroke="#68dbae"
                strokeWidth="2"
              />
              {/* Data dots */}
              {SAMPLE_DATA.map((val, i) => {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const r = 80 * val;
                const cx = 100 + r * Math.cos(angle);
                const cy = 100 + r * Math.sin(angle);
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="3"
                    fill="#68dbae"
                  />
                );
              })}
              {/* Labels */}
              {RADAR_LABELS.map((label, i) => {
                const angle = (Math.PI / 3) * i - Math.PI / 2;
                const x = 100 + 95 * Math.cos(angle);
                const y = 100 + 95 * Math.sin(angle);
                return (
                  <text
                    key={label}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#bccac1"
                    fontSize="7"
                    fontFamily="var(--font-body)"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 3. Role Management */}
        <div className={`${styles.card} ${styles.roleCard}`}>
          <div className={styles.roleCardInner}>
            <div>
              <span className={`material-symbols-outlined ${styles.cardIcon}`}>
                person_add
              </span>
              <h3 className={styles.cardTitle}>역할 관리</h3>
              <p className={styles.cardDesc}>
                가짜 9번부터 인버티드 윙백까지 세분화된 지침 세트로 전술 의무를
                할당하세요.
              </p>
            </div>
            <div className={styles.roleThumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZTekVFo70UYF3O2g8DLek2qIBqFogBHGLz98vKunqN00r6tbyAWaZ9UA2mUkuMZ2zwFBsvxV9Cx5vrYN7AAnzErqtS-M8N8iNbvt7HBYaWUV1SPEtCpBJ8riYXAsrLF-H2k5VqrOhApmbjh3zssQ9wjDyn_m7hdFv-gich-i_oG9tf-BDKsSYoQE3ucvHgJWmX5oHh43qxABT4tUEDLqDdidA2W7hLWlVUHzoXxO0jJElXbMF4UkHIha63ThHftefHoBCdZF0PwU"
                alt="Player thumbnail"
                className={styles.roleImage}
              />
            </div>
          </div>
        </div>

        {/* 4. Quick Sync */}
        <div className={`${styles.card} ${styles.syncCard}`}>
          <div>
            <span className={`material-symbols-outlined ${styles.syncIcon}`}>
              app_registration
            </span>
            <h3 className={styles.syncTitle}>빠른 동기화</h3>
            <p className={styles.syncDesc}>
              새로운 인재를 몇 초 만에 등록하세요. 스캔 ID 또는 과거 퍼포먼스
              데이터를 대량으로 임포트하세요.
            </p>
          </div>
          <button className={styles.syncBtn}>등록 시작</button>
        </div>
      </div>
    </section>
  );
}

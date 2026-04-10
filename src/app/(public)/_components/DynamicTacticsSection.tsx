import styles from "./DynamicTacticsSection.module.scss";

const STEPS = [
  {
    number: "01",
    title: "명단 등록",
    desc: "매치데이를 위해 활성화된 스쿼드를 불러오고 사용 가능한 선수를 선택하세요.",
  },
  {
    number: "02",
    title: "피치 레이아웃",
    desc: "디지털 전술판 위로 선수를 드래그 앤 드롭하세요. 모든 표준 및 커스텀 포메이션을 지원합니다.",
  },
  {
    number: "03",
    title: "라이브 드로잉",
    desc: "이동 패턴, 패스 라인을 스케치하고 피치 위에서 직접 압박 트리거를 설정하세요.",
  },
  {
    number: "04",
    title: "저장 & 동기화",
    desc: "전술을 클라우드에 저장하세요. 선수와 스태프는 경기 일정에 맞춰 자동 업데이트를 받습니다.",
  },
];

const SETTINGS = [
  { label: "너비", value: "넓게" },
  { label: "수비 라인", value: "높은 압박" },
  { label: "템포", value: "다이렉트" },
];

export default function DynamicTacticsSection() {
  return (
    <section id="formation" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>DYNAMIC TACTICS</h2>

        {/* Steps */}
        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <div key={step.number}>
              <div
                className={
                  i === STEPS.length - 1 ? styles.stepLast : styles.step
                }
              >
                <div className={styles.stepNumber}>{step.number}</div>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Visualization */}
        <div className={styles.visualization}>
          <div className={styles.vizOverlay} />
          <div className={styles.vizContent}>
            {/* Pitch */}
            <div className={styles.pitch}>
              <div className={styles.pitchMarkings}>
                <div className={styles.pitchField}>
                  <div className={styles.pitchCenter} />
                  <div className={styles.pitchCircle} />
                </div>
              </div>
              <div className={styles.markerST}>ST</div>
              <div className={styles.markerLM}>LM</div>
              <div className={styles.markerRM}>RM</div>
            </div>

            {/* Sidebar */}
            <div className={styles.vizSidebar}>
              <div>
                <h5 className={styles.sidebarLabel}>현재 설정</h5>
                <p className={styles.sidebarTitle}>
                  디지털 전술판 위로 선수를 드래그 앤 드롭하세요. 모든 표준 및
                  커스텀 포메이션을 지원합니다.
                </p>
              </div>
              <div className={styles.settingsList}>
                {SETTINGS.map((s) => (
                  <div key={s.label} className={styles.settingRow}>
                    <span className={styles.settingLabel}>{s.label}</span>
                    <span className={styles.settingValue}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

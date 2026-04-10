"use client";

import { useRouter } from "next/navigation";
import type { Schedule, ScheduleDetail } from "@/types";
import Button from "@/app/_components/Button/Button";
import styles from "../schedules.module.scss";

interface ScheduleDetailPanelProps {
  selectedDate: string | null;
  schedulesOnDate: Schedule[];
  selectedSchedule: ScheduleDetail | null;
  detailLoading: boolean;
  canEdit: boolean;
  onScheduleClick: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ScheduleDetailPanel({
  selectedDate,
  schedulesOnDate,
  selectedSchedule,
  detailLoading,
  canEdit,
  onScheduleClick,
  onEdit,
  onDelete,
}: ScheduleDetailPanelProps) {
  const router = useRouter();

  if (!selectedDate) {
    return (
      <div className={styles.detailPanel}>
        <div className={styles.detailEmpty}>
          <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", opacity: 0.2 }}>
            calendar_today
          </span>
          <p>날짜를 선택하면 일정을 확인할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPanel}>
      {/* Date header */}
      <div className={styles.detailHeader}>
        <h3 className={styles.detailDate}>{selectedDate}</h3>
        <span className={styles.detailCount}>
          {schedulesOnDate.length}개 일정
        </span>
      </div>

      {/* Schedule list for the date */}
      {schedulesOnDate.length === 0 ? (
        <p className={styles.detailEmptyText}>해당 날짜에 등록된 일정이 없습니다.</p>
      ) : (
        <div className={styles.detailList}>
          {schedulesOnDate.map((s) => (
            <div
              key={s.id}
              className={`${styles.detailCard} ${selectedSchedule?.id === s.id ? styles.detailCardActive : ""}`}
              onClick={() => onScheduleClick(s.id)}
            >
              <h4 className={styles.detailCardTitle}>{s.title}</h4>
              <span className={styles.detailCardMeta}>
                {s.matchTime
                  ? `${String(new Date(s.matchTime).getHours()).padStart(2, "0")}:${String(new Date(s.matchTime).getMinutes()).padStart(2, "0")}`
                  : "시간 미정"}
                {s.location && ` · ${s.location}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Selected schedule detail */}
      {detailLoading && (
        <div className={styles.detailLoading}>불러오는 중...</div>
      )}

      {selectedSchedule && !detailLoading && (
        <div className={styles.detailContent}>
          <div className={styles.detailSection}>
            <h4 className={styles.detailSectionTitle}>{selectedSchedule.title}</h4>

            <div className={styles.detailInfo}>
              <div className={styles.detailInfoRow}>
                <span className="material-symbols-outlined">schedule</span>
                <span>
                  {selectedSchedule.matchTime
                    ? `${String(new Date(selectedSchedule.matchTime).getHours()).padStart(2, "0")}:${String(new Date(selectedSchedule.matchTime).getMinutes()).padStart(2, "0")}`
                    : "시간 미정"}
                </span>
              </div>
              {selectedSchedule.location && (
                <div className={styles.detailInfoRow}>
                  <span className="material-symbols-outlined">location_on</span>
                  <span>{selectedSchedule.location}</span>
                </div>
              )}
              {selectedSchedule.note && (
                <div className={styles.detailInfoRow}>
                  <span className="material-symbols-outlined">sticky_note_2</span>
                  <span>{selectedSchedule.note}</span>
                </div>
              )}
            </div>

            {canEdit && (
              <div className={styles.detailActions}>
                <Button variant="secondary" size="sm" icon="edit" onClick={onEdit}>
                  수정
                </Button>
                <Button variant="danger" size="sm" icon="delete" onClick={onDelete}>
                  삭제
                </Button>
              </div>
            )}
          </div>

          {/* Formations for the match date */}
          {selectedSchedule.formations && selectedSchedule.formations.length > 0 && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionLabel}>포메이션</h4>
              <div className={styles.detailFormations}>
                {selectedSchedule.formations.map((f) => (
                  <div
                    key={f.id}
                    className={styles.detailFormationCard}
                    onClick={() => router.push(`/formations/${f.id}`)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                      sports_soccer
                    </span>
                    <span>{f.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

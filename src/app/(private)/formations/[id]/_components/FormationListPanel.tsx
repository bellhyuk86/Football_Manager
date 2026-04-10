"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import type { Formation } from "@/types";
import styles from "../editor.module.scss";

export default function FormationListPanel() {
  const router = useRouter();
  const params = useParams();
  const currentId = params.id as string;

  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/formations");
        setFormations(data);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className={styles.squadEmpty}>포메이션 목록을 불러오는 중...</p>;
  }

  if (formations.length === 0) {
    return <p className={styles.squadEmpty}>저장된 포메이션이 없습니다.</p>;
  }

  return (
    <div className={styles.formationList}>
      {formations.map((f) => {
        const isActive = f.id === currentId;
        return (
          <div
            key={f.id}
            className={`${styles.formationCard} ${isActive ? styles.formationCardActive : ""}`}
            onClick={() => {
              if (!isActive) router.push(`/formations/${f.id}`);
            }}
          >
            <h4 className={styles.formationCardTitle}>{f.title}</h4>
            <span className={styles.formationCardDate}>
              <span className={`material-symbols-outlined ${styles.formationCardDateIcon}`}>
                calendar_today
              </span>
              {f.matchDate?.split("T")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

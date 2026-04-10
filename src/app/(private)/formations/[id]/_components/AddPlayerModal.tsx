"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import Checkbox from "@/app/_components/Checkbox/Checkbox";
import type { Player, Position } from "@/types";
import styles from "../editor.module.scss";

const POSITION_ORDER: Position[] = ["GK", "DF", "MF", "FW"];

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (players: Player[], asType: "starter" | "substitute") => void;
  excludeIds: string[];
}

export default function AddPlayerModal({
  isOpen,
  onClose,
  onConfirm,
  excludeIds,
}: AddPlayerModalProps) {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addAs, setAddAs] = useState<"starter" | "substitute">("starter");

  useEffect(() => {
    if (!isOpen) return;
    setSelected(new Set());
    setLoading(true);
    api
      .get("/players")
      .then(({ data }) => setAllPlayers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  const available = allPlayers.filter((p) => !excludeIds.includes(p.id));
  const grouped = POSITION_ORDER.map((pos) => ({
    position: pos,
    players: available.filter((p) => p.position === pos),
  }));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isAllSelected = available.length > 0 && selected.size === available.length;

  const toggleAll = () => {
    if (isAllSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(available.map((p) => p.id)));
    }
  };

  const handleConfirm = () => {
    const selectedPlayers = allPlayers.filter((p) => selected.has(p.id));
    onConfirm(selectedPlayers, addAs);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className={styles.addModalHeader}>
        <h2 className={styles.addModalTitle}>선수 추가</h2>
        <p className={styles.addModalDesc}>출전 선수를 선택하세요.</p>
      </header>

      {/* Add as toggle */}
      <div className={styles.addModalToggle}>
        <button
          className={`${styles.addModalToggleBtn} ${addAs === "starter" ? styles.addModalToggleBtnActive : ""}`}
          onClick={() => setAddAs("starter")}
        >
          선발
        </button>
        <button
          className={`${styles.addModalToggleBtn} ${addAs === "substitute" ? styles.addModalToggleBtnActive : ""}`}
          onClick={() => setAddAs("substitute")}
        >
          교체
        </button>
      </div>

      {/* Select All */}
      {!loading && available.length > 0 && (
        <div className={styles.addModalSelectAll}>
          <Checkbox
            checked={isAllSelected}
            onChange={toggleAll}
            label={`전체 선택 (${selected.size}/${available.length})`}
          />
        </div>
      )}

      {/* Player list */}
      <div className={styles.addModalList}>
        {loading ? (
          <p className={styles.addModalLoading}>불러오는 중...</p>
        ) : available.length === 0 ? (
          <p className={styles.addModalLoading}>추가할 수 있는 선수가 없습니다.</p>
        ) : (
          grouped.map(
            (group) =>
              group.players.length > 0 && (
                <div key={group.position} className={styles.addModalGroup}>
                  <span className={styles.addModalGroupLabel}>
                    {group.position}
                  </span>
                  {group.players.map((player) => (
                    <div key={player.id} className={styles.addModalItem}>
                      <Checkbox
                        checked={selected.has(player.id)}
                        onChange={() => toggle(player.id)}
                        label={
                          <>
                            <span className={styles.addModalItemName}>
                              {player.name}
                            </span>
                            <span className={styles.addModalItemOvr}>
                              OVR {player.ovr}
                            </span>
                          </>
                        }
                      />
                    </div>
                  ))}
                </div>
              )
          )
        )}
      </div>

      <Button
        size="lg"
        fullWidth
        disabled={selected.size === 0}
        onClick={handleConfirm}
      >
        {selected.size}명 추가
      </Button>
    </Modal>
  );
}

"use client";

import type { FormationEditorState } from "../_hooks/useFormationEditor";
import Button from "@/app/_components/Button/Button";
import SquadPlayerCard from "./SquadPlayerCard";
import FormationListPanel from "./FormationListPanel";
import styles from "../editor.module.scss";

interface SquadPanelProps {
  state: FormationEditorState;
  onTabChange: (tab: "squad" | "formation") => void;
  onOpenAddModal: () => void;
  onRemovePlayer: (playerId: string) => void;
  onMoveToStarters: (playerId: string) => void;
  onMoveToSubstitutes: (playerId: string) => void;
  readOnly?: boolean;
}

export default function SquadPanel({
  state,
  onTabChange,
  onOpenAddModal,
  onRemovePlayer,
  onMoveToStarters,
  onMoveToSubstitutes,
  readOnly = false,
}: SquadPanelProps) {
  return (
    <div className={styles.squadPanel}>
      {/* Tabs */}
      <div className={styles.squadTabs}>
        <button
          className={`${styles.squadTab} ${state.activeTab === "squad" ? styles.squadTabActive : ""}`}
          onClick={() => onTabChange("squad")}
        >
          SQUAD LIST
        </button>
        <button
          className={`${styles.squadTab} ${state.activeTab === "formation" ? styles.squadTabActive : ""}`}
          onClick={() => onTabChange("formation")}
        >
          FORMATION
        </button>
      </div>

      {/* Content */}
      {state.activeTab === "squad" ? (
        <div className={styles.squadContent}>
          {/* Starters */}
          <div className={styles.squadSection}>
            <div className={styles.squadSectionHeader}>
              <span className={styles.squadSectionTitle}>STARTERS</span>
              <span className={styles.squadSectionCount}>
                {state.starters.length}/11
              </span>
            </div>
            <div className={styles.squadList}>
              {state.starters.map((entry) => (
                <SquadPlayerCard
                  key={entry.playerId}
                  entry={entry}
                  onRemove={onRemovePlayer}
                  onSwapType={onMoveToSubstitutes}
                  swapLabel="교체 선수로 이동"
                  readOnly={readOnly}
                />
              ))}
              {state.starters.length === 0 && (
                <p className={styles.squadEmpty}>선발 선수를 추가하세요.</p>
              )}
            </div>
          </div>

          {/* Substitutes */}
          <div className={styles.squadSection}>
            <div className={styles.squadSectionHeader}>
              <span className={styles.squadSectionTitle}>SUBSTITUTES</span>
            </div>
            <div className={styles.squadList}>
              {state.substitutes.map((entry) => (
                <SquadPlayerCard
                  key={entry.playerId}
                  entry={entry}
                  onRemove={onRemovePlayer}
                  onSwapType={onMoveToStarters}
                  swapLabel="선발 선수로 이동"
                  readOnly={readOnly}
                />
              ))}
              {state.substitutes.length === 0 && (
                <p className={styles.squadEmpty}>교체 선수가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.squadContent}>
          <FormationListPanel />
        </div>
      )}

      {/* Add Player Button */}
      {!readOnly && (
        <div className={styles.squadFooter}>
          <Button
            variant="secondary"
            size="md"
            icon="person_add"
            fullWidth
            onClick={onOpenAddModal}
          >
            ADD PLAYER
          </Button>
        </div>
      )}
    </div>
  );
}

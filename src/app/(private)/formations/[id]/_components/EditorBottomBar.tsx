"use client";

import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import DateInput from "@/app/_components/DateInput/DateInput";
import styles from "../editor.module.scss";

interface EditorBottomBarProps {
  title: string;
  matchDate: string;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDiscard: () => void;
  onSave: () => void;
  isSaving: boolean;
  canSave: boolean;
  readOnly?: boolean;
}

export default function EditorBottomBar({
  title,
  matchDate,
  onTitleChange,
  onDateChange,
  onDiscard,
  onSave,
  isSaving,
  canSave,
  readOnly = false,
}: EditorBottomBarProps) {
  return (
    <div className={styles.bottomBar}>
      <div className={styles.bottomBarField}>
        <label className={styles.bottomBarLabel}>FORMATION TITLE</label>
        <TextInput
          className={styles.bottomBarInput}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="포메이션 제목을 입력하세요"
          disabled={readOnly}
        />
      </div>

      <div className={styles.bottomBarField}>
        <label className={styles.bottomBarLabel}>MATCH DATE</label>
        <DateInput
          className={styles.bottomBarInput}
          value={matchDate}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={readOnly}
          popoverPosition="top"
        />
      </div>

      {!readOnly && (
        <div className={styles.bottomBarActions}>
          <Button variant="secondary" size="md" onClick={onDiscard}>
            DISCARD
          </Button>
          <Button
            size="md"
            icon="save"
            onClick={onSave}
            disabled={!canSave || isSaving}
          >
            {isSaving ? "SAVING..." : "SAVE FORMATION"}
          </Button>
        </div>
      )}
    </div>
  );
}

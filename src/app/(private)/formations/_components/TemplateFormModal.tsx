"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import type {
  FormationTemplate,
  FormationTemplatePayload,
  TemplateLabel,
  TemplatePosition,
} from "../_types";
import styles from "../formations.module.scss";

const LABEL_OPTIONS: TemplateLabel[] = [
  "GK",
  "LB", "CB", "RB", "LWB", "RWB",
  "CDM", "CM", "CAM", "LM", "RM",
  "LW", "RW", "ST",
];

const DEFAULT_LABEL: TemplateLabel = "CM";
const MAX_SLOTS = 11;

interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTarget: FormationTemplate | null;
  onCreate: (payload: FormationTemplatePayload) => Promise<boolean>;
  onUpdate: (id: string, payload: FormationTemplatePayload) => Promise<boolean>;
}

export default function TemplateFormModal({
  isOpen,
  onClose,
  editTarget,
  onCreate,
  onUpdate,
}: TemplateFormModalProps) {
  const [name, setName] = useState("");
  const [positions, setPositions] = useState<TemplatePosition[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pitchRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ idx: number; moved: boolean } | null>(null);

  // Reset on open
  useEffect(() => {
    if (!isOpen) return;
    if (editTarget) {
      setName(editTarget.name);
      setPositions(editTarget.positions);
    } else {
      setName("");
      setPositions([]);
    }
    setSelectedIdx(null);
  }, [isOpen, editTarget]);

  const getPitchCoords = useCallback((clientX: number, clientY: number) => {
    const rect = pitchRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  }, []);

  const handlePitchClick = (e: React.MouseEvent) => {
    if (draggingRef.current?.moved) return;
    if ((e.target as HTMLElement).closest(`.${styles.templateEditSlot}`)) return;
    if (positions.length >= MAX_SLOTS) {
      toast.error(`슬롯은 최대 ${MAX_SLOTS}개까지 배치할 수 있습니다.`);
      return;
    }
    const coords = getPitchCoords(e.clientX, e.clientY);
    if (!coords) return;
    setPositions((prev) => [...prev, { label: DEFAULT_LABEL, ...coords }]);
    setSelectedIdx(positions.length);
  };

  const handleSlotMouseDown = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    draggingRef.current = { idx, moved: false };
    setSelectedIdx(idx);

    const handleMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current.moved = true;
      const coords = getPitchCoords(ev.clientX, ev.clientY);
      if (!coords) return;
      setPositions((prev) =>
        prev.map((p, i) => (i === draggingRef.current!.idx ? { ...p, ...coords } : p))
      );
    };

    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      setTimeout(() => {
        draggingRef.current = null;
      }, 0);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  const handleLabelChange = (idx: number, label: TemplateLabel) => {
    setPositions((prev) => prev.map((p, i) => (i === idx ? { ...p, label } : p)));
  };

  const handleRemoveSlot = (idx: number) => {
    setPositions((prev) => prev.filter((_, i) => i !== idx));
    setSelectedIdx(null);
  };

  const handleReset = () => {
    setPositions([]);
    setSelectedIdx(null);
  };

  const handleSubmit = async () => {
    if (name.trim() === "") {
      toast.error("템플릿 이름을 입력해주세요.");
      return;
    }
    if (positions.length !== MAX_SLOTS) {
      toast.error(`정확히 ${MAX_SLOTS}개의 슬롯을 배치해야 합니다. (현재 ${positions.length}개)`);
      return;
    }

    setSubmitting(true);
    const payload: FormationTemplatePayload = { name: name.trim(), positions };
    const ok = editTarget
      ? await onUpdate(editTarget.id, payload)
      : await onCreate(payload);
    setSubmitting(false);
    if (ok) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} panelClassName={styles.templateFormPanel}>
      <div className={styles.templateFormModal}>
        <h3 className={styles.templateFormTitle}>
          {editTarget ? "템플릿 수정" : "새 템플릿 만들기"}
        </h3>
        <p className={styles.templateFormDesc}>
          피치를 클릭해서 슬롯을 추가하고, 드래그해서 위치를 조정하세요. ({positions.length}/{MAX_SLOTS})
        </p>

        <div className={styles.templateFormField}>
          <label className={styles.templateFormLabel}>템플릿 이름</label>
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 4-3-3"
            maxLength={50}
          />
        </div>

        <div
          ref={pitchRef}
          className={styles.templateEditPitch}
          onClick={handlePitchClick}
        >
          <div className={styles.templatePitchCenter}>
            <div className={styles.templatePitchCircle} />
          </div>
          <div className={styles.templatePitchLine} />
          <div className={styles.templatePitchPenaltyTop} />
          <div className={styles.templatePitchPenaltyBottom} />

          {positions.length === 0 && (
            <div className={styles.templateEditPitchEmpty}>
              <span className="material-symbols-outlined">ads_click</span>
              <p>피치를 클릭해서 슬롯을 추가하세요</p>
              <small>총 {MAX_SLOTS}개의 슬롯을 배치할 수 있어요</small>
            </div>
          )}

          {positions.map((pos, i) => (
            <div
              key={i}
              className={`${styles.templateEditSlot} ${selectedIdx === i ? styles.templateEditSlotActive : ""}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseDown={(e) => handleSlotMouseDown(i, e)}
            >
              <div className={styles.templateDotCircle} />
              <span className={styles.templateDotLabel}>{pos.label}</span>
            </div>
          ))}
        </div>

        {selectedIdx !== null && positions[selectedIdx] && (
          <div className={styles.templateFormSlotEditor}>
            <span className={styles.templateFormLabel}>선택된 슬롯</span>
            <div className={styles.templateFormSlotRow}>
              <select
                className={styles.templateFormSelect}
                value={positions[selectedIdx].label}
                onChange={(e) =>
                  handleLabelChange(selectedIdx, e.target.value as TemplateLabel)
                }
              >
                {LABEL_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.templateFormSlotRemoveBtn}
                onClick={() => handleRemoveSlot(selectedIdx)}
              >
                <span className="material-symbols-outlined">delete</span>
                삭제
              </button>
            </div>
          </div>
        )}

        <div className={styles.templateFormActions}>
          <Button variant="secondary" size="md" onClick={handleReset}>
            전체 초기화
          </Button>
          <div className={styles.templateFormActionsRight}>
            <Button variant="secondary" size="md" onClick={onClose}>
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {editTarget ? "수정" : "생성"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

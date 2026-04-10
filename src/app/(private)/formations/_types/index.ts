import type { FormationDetail } from "@/types";

export interface FormationCardProps {
  formation: FormationDetail;
  canEdit: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface MiniPitchProps {
  formation: FormationDetail;
}

export interface DeleteFormationModalProps {
  target: FormationDetail | null;
  onClose: () => void;
  onConfirm: () => void;
}

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

export type TemplateLabel =
  | "GK"
  | "LB" | "CB" | "RB" | "LWB" | "RWB"
  | "CDM" | "CM" | "CAM" | "LM" | "RM"
  | "LW" | "RW" | "ST";

export interface TemplatePosition {
  label: TemplateLabel;
  x: number;
  y: number;
}

export interface FormationTemplate {
  id: string;
  name: string;
  positions: TemplatePosition[];
  createdAt: string;
  updatedAt: string;
}

export interface FormationTemplatePayload {
  name: string;
  positions: TemplatePosition[];
}

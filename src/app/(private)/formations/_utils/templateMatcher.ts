import type { Player, Position } from "@/types";
import type { TemplateLabel, TemplatePosition } from "../_types";

// ─── Label → General Position ───
const LABEL_TO_POSITION: Record<TemplateLabel, Position> = {
  GK: "GK",
  LB: "DF", CB: "DF", RB: "DF", LWB: "DF", RWB: "DF",
  CDM: "MF", CM: "MF", CAM: "MF", LM: "MF", RM: "MF",
  LW: "FW", RW: "FW", ST: "FW",
};

// ─── Fitness score per label ───
export function calculateFitness(
  label: TemplateLabel,
  player: Pick<Player, "speed" | "shooting" | "passing" | "dribbling" | "defending" | "physical">
): number {
  const { speed, shooting, passing, dribbling, defending, physical } = player;

  switch (label) {
    case "GK":
      return defending * 2 + physical;
    case "CB":
      return defending * 2 + physical * 1.5 + passing;
    case "LB":
    case "RB":
      return defending * 1.5 + speed * 1.5 + physical + passing;
    case "LWB":
    case "RWB":
      return speed * 2 + defending + dribbling * 1.5 + passing;
    case "CDM":
      return defending * 1.5 + physical * 1.5 + passing * 1.5;
    case "CM":
      return passing * 1.5 + physical + dribbling + defending;
    case "CAM":
      return passing * 1.5 + dribbling * 1.5 + shooting;
    case "LM":
    case "RM":
      return speed * 1.5 + dribbling * 1.5 + passing;
    case "LW":
    case "RW":
      return speed * 1.5 + dribbling * 1.5 + shooting + passing;
    case "ST":
      return shooting * 2 + physical + speed + dribbling;
  }
}

export function getLabelPosition(label: TemplateLabel): Position {
  return LABEL_TO_POSITION[label];
}

// ─── Match players to template slots ───
export interface SlotAssignment {
  slot: TemplatePosition;
  player: Player | null;
}

export interface TemplateMatchResult {
  assignments: SlotAssignment[];
  remaining: Player[];
}

export function matchPlayersToTemplate(
  positions: TemplatePosition[],
  players: Player[]
): TemplateMatchResult {
  const used = new Set<string>();
  const assignments: SlotAssignment[] = [];

  for (const slot of positions) {
    const targetPosition = LABEL_TO_POSITION[slot.label];
    const candidates = players.filter(
      (p) => !used.has(p.id) && p.position === targetPosition
    );

    if (candidates.length === 0) {
      assignments.push({ slot, player: null });
      continue;
    }

    const best = candidates
      .map((p) => ({ player: p, score: calculateFitness(slot.label, p) }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(a.player.createdAt).getTime() - new Date(b.player.createdAt).getTime();
      })[0];

    used.add(best.player.id);
    assignments.push({ slot, player: best.player });
  }

  const remaining = players.filter((p) => !used.has(p.id));
  return { assignments, remaining };
}

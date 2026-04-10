import { Request, Response } from "express";
import prisma from "../lib/prisma";

interface TemplatePosition {
  label: string;
  x: number;
  y: number;
}

const VALID_LABELS = new Set([
  "GK",
  "LB", "CB", "RB", "LWB", "RWB",
  "CDM", "CM", "CAM", "LM", "RM",
  "LW", "RW", "ST",
]);

function validatePositions(positions: unknown): positions is TemplatePosition[] {
  if (!Array.isArray(positions) || positions.length !== 11) return false;
  return positions.every(
    (p) =>
      typeof p === "object" &&
      p !== null &&
      typeof p.label === "string" &&
      VALID_LABELS.has(p.label) &&
      typeof p.x === "number" &&
      typeof p.y === "number" &&
      p.x >= 0 && p.x <= 100 &&
      p.y >= 0 && p.y <= 100
  );
}

// GET /api/formation-templates
export async function getTemplates(req: Request, res: Response): Promise<void> {
  try {
    const templates = await prisma.formationTemplate.findMany({
      where: { teamId: req.user!.teamId! },
      orderBy: { createdAt: "asc" },
    });
    res.json(templates);
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// GET /api/formation-templates/:id
export async function getTemplate(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const template = await prisma.formationTemplate.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!template) {
      res.status(404).json({ error: "템플릿을 찾을 수 없습니다." });
      return;
    }

    res.json(template);
  } catch (error) {
    console.error("Get template error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/formation-templates
export async function createTemplate(req: Request, res: Response): Promise<void> {
  try {
    const { name, positions } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "템플릿 이름을 입력해주세요." });
      return;
    }

    if (!validatePositions(positions)) {
      res.status(400).json({
        error: "포지션 정보가 올바르지 않습니다. 11개의 유효한 포지션이 필요합니다.",
      });
      return;
    }

    const template = await prisma.formationTemplate.create({
      data: {
        teamId: req.user!.teamId!,
        createdBy: req.user!.userId,
        name: name.trim(),
        positions: positions as unknown as object,
      },
    });

    res.status(201).json(template);
  } catch (error) {
    console.error("Create template error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/formation-templates/:id
export async function updateTemplate(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { name, positions } = req.body;

    const existing = await prisma.formationTemplate.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!existing) {
      res.status(404).json({ error: "템플릿을 찾을 수 없습니다." });
      return;
    }

    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      res.status(400).json({ error: "템플릿 이름을 입력해주세요." });
      return;
    }

    if (positions !== undefined && !validatePositions(positions)) {
      res.status(400).json({
        error: "포지션 정보가 올바르지 않습니다. 11개의 유효한 포지션이 필요합니다.",
      });
      return;
    }

    const template = await prisma.formationTemplate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(positions !== undefined && { positions: positions as unknown as object }),
      },
    });

    res.json(template);
  } catch (error) {
    console.error("Update template error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// DELETE /api/formation-templates/:id
export async function deleteTemplate(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.formationTemplate.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!existing) {
      res.status(404).json({ error: "템플릿을 찾을 수 없습니다." });
      return;
    }

    await prisma.formationTemplate.delete({ where: { id } });
    res.json({ message: "템플릿이 삭제되었습니다." });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

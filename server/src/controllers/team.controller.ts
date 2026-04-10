import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { createUniqueInviteCode } from "../lib/inviteCode";

// GET /api/teams/me
export async function getMyTeam(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.teamId) {
      res.status(404).json({ error: "소속 팀이 없습니다." });
      return;
    }

    const team = await prisma.team.findUnique({
      where: { id: req.user.teamId },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });

    if (!team) {
      res.status(404).json({ error: "팀을 찾을 수 없습니다." });
      return;
    }

    res.json(team);
  } catch (error) {
    console.error("Get team error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/teams/me
export async function updateMyTeam(req: Request, res: Response): Promise<void> {
  try {
    const { name } = req.body;

    const team = await prisma.team.update({
      where: { id: req.user!.teamId! },
      data: { name },
    });

    res.json({ id: team.id, name: team.name });
  } catch (error) {
    console.error("Update team error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// GET /api/teams/me/invite-code
export async function getInviteCode(req: Request, res: Response): Promise<void> {
  try {
    const team = await prisma.team.findUnique({
      where: { id: req.user!.teamId! },
      select: { inviteCode: true },
    });

    if (!team) {
      res.status(404).json({ error: "팀을 찾을 수 없습니다." });
      return;
    }

    res.json({ inviteCode: team.inviteCode });
  } catch (error) {
    console.error("Get invite code error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/teams/me/invite-code
export async function regenerateInviteCode(req: Request, res: Response): Promise<void> {
  try {
    const newCode = await createUniqueInviteCode();

    await prisma.team.update({
      where: { id: req.user!.teamId! },
      data: { inviteCode: newCode },
    });

    res.json({ inviteCode: newCode });
  } catch (error) {
    console.error("Regenerate invite code error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/teams/verify-invite-code
export async function verifyInviteCode(req: Request, res: Response): Promise<void> {
  try {
    const { inviteCode } = req.body;

    const team = await prisma.team.findUnique({
      where: { inviteCode },
      select: { id: true, name: true },
    });

    if (!team) {
      res.status(400).json({ error: "유효하지 않은 초대코드입니다." });
      return;
    }

    res.json({ valid: true, teamName: team.name });
  } catch (error) {
    console.error("Verify invite code error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

import { Request, Response } from "express";
import prisma from "../lib/prisma";

function withOvr<T extends { speed: number; shooting: number; passing: number; dribbling: number; defending: number; physical: number }>(
  player: T
) {
  const ovr = Math.round(
    (player.speed + player.shooting + player.passing + player.dribbling + player.defending + player.physical) / 6
  );
  return { ...player, ovr };
}

// GET /api/players
export async function getPlayers(req: Request, res: Response): Promise<void> {
  try {
    const position = req.query.position as string | undefined;

    const where: Record<string, unknown> = { teamId: req.user!.teamId! };
    if (position && ["GK", "DF", "MF", "FW"].includes(position)) {
      where.position = position;
    }

    const players = await prisma.player.findMany({
      where,
      include: { user: { select: { profileImage: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(players.map((p) => {
      const { user, ...rest } = p;
      return { ...withOvr(rest), profileImage: user?.profileImage || null };
    }));
  } catch (error) {
    console.error("Get players error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/players
export async function createPlayer(req: Request, res: Response): Promise<void> {
  try {
    const { name, position, speed, shooting, passing, dribbling, defending, physical, userId } =
      req.body;

    const player = await prisma.player.create({
      data: {
        teamId: req.user!.teamId!,
        name,
        position,
        speed: speed ?? 50,
        shooting: shooting ?? 50,
        passing: passing ?? 50,
        dribbling: dribbling ?? 50,
        defending: defending ?? 50,
        physical: physical ?? 50,
        userId: userId || null,
      },
    });

    res.status(201).json(withOvr(player));
  } catch (error) {
    console.error("Create player error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// GET /api/players/me
export async function getMyPlayer(req: Request, res: Response): Promise<void> {
  try {
    const player = await prisma.player.findFirst({
      where: { userId: req.user!.userId, teamId: req.user!.teamId! },
      include: { user: { select: { profileImage: true } } },
    });

    if (!player) {
      res.status(404).json({ error: "연결된 선수 카드가 없습니다." });
      return;
    }

    const { user, ...rest } = player;
    res.json({ ...withOvr(rest), profileImage: user?.profileImage || null });
  } catch (error) {
    console.error("Get my player error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// GET /api/players/:id
export async function getPlayer(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const player = await prisma.player.findFirst({
      where: { id, teamId: req.user!.teamId! },
      include: { user: { select: { profileImage: true } } },
    });

    if (!player) {
      res.status(404).json({ error: "선수를 찾을 수 없습니다." });
      return;
    }

    const { user, ...rest } = player;
    res.json({ ...withOvr(rest), profileImage: user?.profileImage || null });
  } catch (error) {
    console.error("Get player error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/players/:id
export async function updatePlayer(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.player.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!existing) {
      res.status(404).json({ error: "선수를 찾을 수 없습니다." });
      return;
    }

    const { name, position, speed, shooting, passing, dribbling, defending, physical, userId } =
      req.body;

    const player = await prisma.player.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(position !== undefined && { position }),
        ...(speed !== undefined && { speed }),
        ...(shooting !== undefined && { shooting }),
        ...(passing !== undefined && { passing }),
        ...(dribbling !== undefined && { dribbling }),
        ...(defending !== undefined && { defending }),
        ...(physical !== undefined && { physical }),
        ...(userId !== undefined && { userId: userId || null }),
      },
    });

    res.json(withOvr(player));
  } catch (error) {
    console.error("Update player error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// DELETE /api/players/:id
export async function deletePlayer(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.player.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!existing) {
      res.status(404).json({ error: "선수를 찾을 수 없습니다." });
      return;
    }

    await prisma.player.delete({ where: { id } });

    res.json({ message: "선수가 삭제되었습니다." });
  } catch (error) {
    console.error("Delete player error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

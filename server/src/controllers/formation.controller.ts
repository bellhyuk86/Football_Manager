import { Request, Response } from "express";
import prisma from "../lib/prisma";

// GET /api/formations
export async function getFormations(req: Request, res: Response): Promise<void> {
  try {
    const matchDate = req.query.match_date as string | undefined;

    const where: Record<string, unknown> = { teamId: req.user!.teamId! };
    if (matchDate) {
      where.matchDate = new Date(matchDate);
    }

    const formations = await prisma.formation.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true } },
        formationPlayers: {
          include: { player: { select: { id: true, name: true, position: true, user: { select: { profileImage: true } } } } },
        },
      },
      orderBy: { matchDate: "desc" },
    });

    res.json(formations);
  } catch (error) {
    console.error("Get formations error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/formations
export async function createFormation(req: Request, res: Response): Promise<void> {
  try {
    const { title, matchDate, placementData, players } = req.body;

    const formation = await prisma.formation.create({
      data: {
        teamId: req.user!.teamId!,
        createdBy: req.user!.userId,
        title,
        matchDate: new Date(matchDate),
        placementData,
        formationPlayers: {
          create: (players || []).map((p: { player_id: string; type: string }) => ({
            playerId: p.player_id,
            type: p.type,
          })),
        },
      },
      include: {
        formationPlayers: {
          include: { player: { select: { id: true, name: true, position: true, user: { select: { profileImage: true } } } } },
        },
      },
    });

    res.status(201).json(formation);
  } catch (error) {
    console.error("Create formation error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// GET /api/formations/:id
export async function getFormation(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const formation = await prisma.formation.findFirst({
      where: { id, teamId: req.user!.teamId! },
      include: {
        creator: { select: { id: true, name: true } },
        formationPlayers: {
          include: { player: { select: { id: true, name: true, position: true, user: { select: { profileImage: true } } } } },
        },
      },
    });

    if (!formation) {
      res.status(404).json({ error: "포메이션을 찾을 수 없습니다." });
      return;
    }

    res.json(formation);
  } catch (error) {
    console.error("Get formation error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/formations/:id
export async function updateFormation(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.formation.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!existing) {
      res.status(404).json({ error: "포메이션을 찾을 수 없습니다." });
      return;
    }

    const { title, matchDate, placementData, players } = req.body;

    if (players) {
      await prisma.formationPlayer.deleteMany({
        where: { formationId: id },
      });
    }

    const formation = await prisma.formation.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(matchDate !== undefined && { matchDate: new Date(matchDate) }),
        ...(placementData !== undefined && { placementData }),
        ...(players && {
          formationPlayers: {
            create: players.map((p: { player_id: string; type: string }) => ({
              playerId: p.player_id,
              type: p.type,
            })),
          },
        }),
      },
      include: {
        formationPlayers: {
          include: { player: { select: { id: true, name: true, position: true, user: { select: { profileImage: true } } } } },
        },
      },
    });

    res.json(formation);
  } catch (error) {
    console.error("Update formation error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// DELETE /api/formations/:id
export async function deleteFormation(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.formation.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!existing) {
      res.status(404).json({ error: "포메이션을 찾을 수 없습니다." });
      return;
    }

    await prisma.formation.delete({ where: { id } });

    res.json({ message: "포메이션이 삭제되었습니다." });
  } catch (error) {
    console.error("Delete formation error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

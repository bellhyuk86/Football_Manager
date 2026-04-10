import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { cloudinary } from "../lib/upload";

// GET /api/users/me
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
        team: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/users/me
export async function updateMe(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, profileImage } = req.body;

    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, id: { not: req.user!.userId } },
      });
      if (existing) {
        res.status(400).json({ error: "이미 사용 중인 이메일입니다." });
        return;
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(profileImage !== undefined && { profileImage }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Update me error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/users/me/password
export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user) {
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      res.status(400).json({ error: "현재 비밀번호가 일치하지 않습니다." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "비밀번호가 변경되었습니다." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// DELETE /api/users/me
export async function deleteMe(req: Request, res: Response): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id: req.user!.userId },
    });

    res.json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.error("Delete me error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// GET /api/users/team-members
export async function getTeamMembers(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.teamId) {
      res.status(400).json({ error: "소속 팀이 없습니다." });
      return;
    }

    const members = await prisma.user.findMany({
      where: { teamId: req.user.teamId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
      },
      orderBy: [
        { role: "asc" },
        { name: "asc" },
      ],
    });

    res.json(members);
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/users/:id/role
export async function changeRole(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!["manager", "coach", "player"].includes(role)) {
      res.status(400).json({ error: "유효하지 않은 역할입니다." });
      return;
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser || targetUser.teamId !== req.user!.teamId) {
      res.status(404).json({ error: "팀원을 찾을 수 없습니다." });
      return;
    }

    // 감독 권한 이양: 새 사용자를 manager로 변경 시 기존 감독을 coach로 변경
    if (role === "manager" && targetUser.role !== "manager") {
      await prisma.user.updateMany({
        where: {
          teamId: req.user!.teamId!,
          role: "manager",
        },
        data: { role: "coach" },
      });
    }

    // 자기 자신의 감독 권한을 내려놓는 경우, 팀에 감독이 없어지는 것을 방지
    if (id === req.user!.userId && role !== "manager") {
      const otherManagers = await prisma.user.count({
        where: {
          teamId: req.user!.teamId!,
          role: "manager",
          id: { not: id },
        },
      });
      if (otherManagers === 0) {
        res.status(400).json({ error: "팀에 최소 1명의 감독이 필요합니다. 먼저 다른 팀원에게 감독 권한을 이양하세요." });
        return;
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, name: true, email: true, role: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("Change role error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/users/me/profile-image
export async function uploadProfileImage(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "파일이 첨부되지 않았습니다." });
      return;
    }

    const imageUrl = (req.file as any).path;

    // Delete old profile image from Cloudinary if exists
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { profileImage: true },
    });
    if (currentUser?.profileImage) {
      const publicId = currentUser.profileImage
        .split("/upload/")[1]
        ?.replace(/^v\d+\//, "")
        ?.replace(/\.[^.]+$/, "");
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { profileImage: imageUrl },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// DELETE /api/users/me/profile-image
export async function deleteProfileImage(req: Request, res: Response): Promise<void> {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { profileImage: true },
    });

    if (currentUser?.profileImage) {
      const publicId = currentUser.profileImage
        .split("/upload/")[1]
        ?.replace(/^v\d+\//, "")
        ?.replace(/\.[^.]+$/, "");
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { profileImage: null },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Delete profile image error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { generateToken, generateResetToken, verifyResetToken } from "../middlewares/auth";
import { createUniqueInviteCode } from "../lib/inviteCode";
import { sendPasswordResetEmail } from "../lib/mailer";

// POST /api/auth/register
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, name, email, password, role, teamName, inviteCode } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
      const field = existingUser.username === username ? "아이디" : "이메일";
      res.status(409).json({ error: `이미 사용 중인 ${field}입니다.` });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "manager") {
      if (!teamName) {
        res.status(400).json({ error: "팀명을 입력해주세요." });
        return;
      }

      const code = await createUniqueInviteCode();
      const team = await prisma.team.create({
        data: { name: teamName, inviteCode: code },
      });

      const user = await prisma.user.create({
        data: {
          username,
          name,
          email,
          password: hashedPassword,
          role: "manager",
          teamId: team.id,
        },
      });

      const token = generateToken({
        userId: user.id,
        teamId: team.id,
        role: "manager",
      });

      res.status(201).json({
        token,
        user: { id: user.id, username, name, email, role: "manager" },
        team: { id: team.id, name: teamName, inviteCode: code },
      });
    } else {
      if (!inviteCode) {
        res.status(400).json({ error: "초대코드를 입력해주세요." });
        return;
      }

      const team = await prisma.team.findUnique({
        where: { inviteCode },
      });
      if (!team) {
        res.status(400).json({ error: "유효하지 않은 초대코드입니다." });
        return;
      }

      const user = await prisma.user.create({
        data: {
          username,
          name,
          email,
          password: hashedPassword,
          role,
          teamId: team.id,
        },
      });

      const token = generateToken({
        userId: user.id,
        teamId: team.id,
        role,
      });

      res.status(201).json({
        token,
        user: { id: user.id, username, name, email, role },
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(401).json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." });
      return;
    }

    const token = generateToken({
      userId: user.id,
      teamId: user.teamId,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/auth/logout
export async function logout(_req: Request, res: Response): Promise<void> {
  res.json({ message: "로그아웃되었습니다." });
}

// POST /api/auth/find-username
export async function findUsername(req: Request, res: Response): Promise<void> {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.findFirst({
      where: { name, email },
    });

    if (!user) {
      res.status(404).json({ error: "일치하는 계정을 찾을 수 없습니다." });
      return;
    }

    const masked =
      user.username.length <= 3
        ? user.username[0] + "*".repeat(user.username.length - 1)
        : user.username.slice(0, 2) +
          "*".repeat(user.username.length - 3) +
          user.username.slice(-1);

    res.json({ username: masked });
  } catch (error) {
    console.error("Find username error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/auth/find-password
export async function findPassword(req: Request, res: Response): Promise<void> {
  try {
    const { username, email } = req.body;

    const user = await prisma.user.findFirst({
      where: { username, email },
    });

    if (!user) {
      res.status(404).json({ error: "일치하는 계정을 찾을 수 없습니다." });
      return;
    }

    const resetToken = generateResetToken(user.id);

    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (mailError) {
      console.error("Mail send error:", mailError);
      res.status(500).json({ error: "이메일 발송에 실패했습니다. SMTP 설정을 확인해주세요." });
      return;
    }

    res.json({
      message: "비밀번호 재설정 링크가 이메일로 발송되었습니다.",
    });
  } catch (error) {
    console.error("Find password error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/auth/reset-password
export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { token, newPassword } = req.body;

    const payload = verifyResetToken(token);
    if (!payload) {
      res.status(400).json({ error: "유효하지 않거나 만료된 토큰입니다." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "비밀번호가 재설정되었습니다." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

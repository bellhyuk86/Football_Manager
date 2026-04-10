import prisma from "./prisma";

export function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "FC-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createUniqueInviteCode(): Promise<string> {
  let code: string;
  let exists: boolean;
  do {
    code = generateInviteCode();
    const team = await prisma.team.findUnique({ where: { inviteCode: code } });
    exists = !!team;
  } while (exists);
  return code;
}

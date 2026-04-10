import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@tactify.com";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
): Promise<void> {
  const resetLink = `${CLIENT_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"Tactify FC" <${FROM}>`,
    to,
    subject: "[Tactify FC] 비밀번호 재설정 안내",
    html: `
      <div style="max-width:480px;margin:0 auto;font-family:sans-serif;color:#222;">
        <h2 style="color:#68DBAE;">Tactify FC</h2>
        <p>안녕하세요, 비밀번호 재설정을 요청하셨습니다.</p>
        <p>아래 버튼을 클릭하여 새 비밀번호를 설정해 주세요.</p>
        <a href="${resetLink}"
           style="display:inline-block;margin:24px 0;padding:12px 32px;
                  background:#68DBAE;color:#1a1a1a;font-weight:700;
                  text-decoration:none;border-radius:8px;">
          비밀번호 재설정
        </a>
        <p style="font-size:13px;color:#888;">
          이 링크는 1시간 동안 유효합니다.<br/>
          본인이 요청하지 않았다면 이 메일을 무시해 주세요.
        </p>
      </div>
    `,
  });
}

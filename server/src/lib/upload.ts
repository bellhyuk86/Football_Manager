import path from "path";
import multer from "multer";
import crypto from "crypto";

const profileStorage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads", "profiles"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomUUID();
    cb(null, `${name}${ext}`);
  },
});

export const uploadProfileImage = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("지원하지 않는 파일 형식입니다. (jpg, png, webp, gif)"));
    }
  },
});

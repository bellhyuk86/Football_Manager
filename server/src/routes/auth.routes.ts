import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/find-username", authController.findUsername);
router.post("/find-password", authController.findPassword);
router.patch("/reset-password", authController.resetPassword);

export default router;

import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { uploadProfileImage } from "../lib/upload";
import * as userController from "../controllers/user.controller";

const router = Router();

router.get("/me", authenticate, userController.getMe);
router.patch("/me", authenticate, userController.updateMe);
router.patch("/me/password", authenticate, userController.changePassword);
router.post("/me/profile-image", authenticate, uploadProfileImage.single("profileImage"), userController.uploadProfileImage);
router.delete("/me/profile-image", authenticate, userController.deleteProfileImage);
router.delete("/me", authenticate, userController.deleteMe);
router.get("/team-members", authenticate, userController.getTeamMembers);
router.patch("/:id/role", authenticate, authorize("manager"), userController.changeRole);

export default router;

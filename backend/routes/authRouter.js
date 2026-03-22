import express from "express";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  protectRoute,
  verifyEmail,
  getProfile,
  resendVerificationToken,
  updateProfile,
  updatePassword
} from "../controllers/authController.js";

const router = express.Router();

// router.get("/verify-auth", verifyAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/resend-verificationToken", protectRoute, resendVerificationToken);
router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);

router.post("/update-password", protectRoute, updatePassword);
router.get("/profile", protectRoute, getProfile);
router.post("/update-profile", protectRoute, updateProfile);
export const authRouter = router;

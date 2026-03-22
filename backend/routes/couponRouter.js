import express from "express";
import { protectRoute } from "../controllers/authController.js";
import { getCoupon, validateCoupon } from "../controllers/couponController.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getCoupon);
router.post("/validate", validateCoupon);

export const couponRouter = router;

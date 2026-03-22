import express from "express";
import { adminRoute, protectRoute } from "../controllers/authController.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAnalytics);

export const analyticsRouter = router;

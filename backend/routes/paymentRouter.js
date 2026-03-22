import express from "express";
import { protectRoute } from "../controllers/authController.js";
import {
  checkoutSuccess,
  createCheckoutSession
} from "../controllers/paymentController.js";

const router = express.Router();

router.use(protectRoute);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/checkout-success", checkoutSuccess);

export const paymentRouter = router;

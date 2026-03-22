import express from "express";
import { protectRoute } from "../controllers/authController.js";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  removeFromCart,
  updateQuantity
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getCartProducts);
router.post("/", addToCart);
router.delete("/", removeAllFromCart);
router.delete("/:id", removeFromCart);
router.patch("/:id", updateQuantity);

export const cartRouter = router;

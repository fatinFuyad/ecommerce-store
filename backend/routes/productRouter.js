import express from "express";
import { adminRoute, protectRoute } from "../controllers/authController.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProduct,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
  updateProduct
} from "../controllers/productsController.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.patch("/update/:id", protectRoute, adminRoute, updateProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

// router.get("/:id", getProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/featuredProducts", getFeaturedProducts); // make indexcing for featured products
router.post("/recommendations", getRecommendedProducts);

export const productRouter = router;

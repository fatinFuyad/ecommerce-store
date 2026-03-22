import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser
} from "../controllers/usersController.js";
import { adminRoute, protectRoute } from "../controllers/authController.js";

const router = express.Router();

router.use(protectRoute, adminRoute);
router.route("/").get(getAllUsers);
router.route("/:userId").get(getUser).delete(deleteUser);

export const userRouter = router;

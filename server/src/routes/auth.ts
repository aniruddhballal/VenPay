import express from "express";
import { register, login, getUser, logout } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getUser);
router.post("/logout", logout);

export default router;

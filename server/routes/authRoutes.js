import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { registerUser, loginUser, refreshSession, logoutUser, getMe } from "../controllers/authController.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshSession);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

export default router;

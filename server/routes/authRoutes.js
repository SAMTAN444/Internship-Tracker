import express from "express"
import { protect, verifyFirebase } from "../middleware/authMiddleware.js"
import { usernameAvailable, createProfile, getMe } from "../controllers/authController.js"

// Sign-up, login, logout and password resets happen in Firebase on the client.
// The server only links a Firebase account to a Trackly profile.
const router = express.Router();

router.get("/username-available", usernameAvailable);
router.post("/profile", verifyFirebase, createProfile);
router.get("/me", protect, getMe);

export default router;

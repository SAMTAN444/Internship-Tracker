import express from "express"
import {
    createInternship,
    getInternships,
    updateInternship,
    deleteInternship,
} from "../controllers/internshipController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.route("/")
    .post(protect, createInternship)
    .get(protect, getInternships);

router.route("/:id")
    .put(protect, updateInternship)
    .delete(protect, deleteInternship);

export default router;
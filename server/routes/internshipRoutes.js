import express from "express"
import {
    createInternship,
    getInternships,
    updateInternship,
    deleteInternship,
    updateBulkStatus,
    getInternshipsById,
} from "../controllers/internshipController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.put("/bulk-status", protect, updateBulkStatus);

router.route("/")
    .post(protect, createInternship)
    .get(protect, getInternships);

router.route("/:id")
    .get(protect, getInternshipsById)
    .put(protect, updateInternship)
    .delete(protect, deleteInternship);

export default router;
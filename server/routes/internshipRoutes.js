import express from "express"
import {
    createInternship,
    getInternships,
    updateInternship,
    deleteInternship,
    updateBulkStatus,
    getInternshipsById,
    getStats,
} from "../controllers/internshipController.js"
import { setReminder, clearReminder, getUpcomingReminders } from "../controllers/reminderController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

// Every internship route is per-user.
router.use(protect);

// Literal paths first so they aren't captured by "/:id"
router.put("/bulk-status", updateBulkStatus);
router.get("/reminders/upcoming", getUpcomingReminders);
router.get("/stats", getStats);

router.route("/")
    .post(createInternship)
    .get(getInternships);

router.route("/:id")
    .get(getInternshipsById)
    .put(updateInternship)
    .delete(deleteInternship);

router.route("/:id/reminder")
    .put(setReminder)
    .delete(clearReminder);

export default router;

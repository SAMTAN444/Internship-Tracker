import Internship, { REMINDER_STATUSES } from "../models/Internship.js"
import findOwned from "../utils/findOwned.js"
import HttpError from "../utils/HttpError.js"

// @route PUT /api/internships/:id/reminder
export const setReminder = async (req, res) => {
    const { type, remindAt, location } = req.body;

    if (!type || !remindAt) {
        throw new HttpError(400, "Reminder type and time required");
    }
    if (!REMINDER_STATUSES.includes(type)) {
        throw new HttpError(400, "Invalid reminder type");
    }
    if (type === "Interview" && !location) {
        throw new HttpError(400, "Interview location is required");
    }

    const internship = await findOwned(req.params.id, req.user._id);

    if (internship.status !== type) {
        throw new HttpError(400, `Cannot set ${type} reminder when status is ${internship.status}`);
    }

    const remindDate = new Date(remindAt);
    if (isNaN(remindDate.getTime())) {
        throw new HttpError(400, "Invalid reminder date");
    }
    if (remindDate <= new Date()) {
        throw new HttpError(400, "Reminder must be in the future");
    }

    internship.reminder = {
        type,
        remindAt: remindDate,
        location: type === "Interview" ? location : null,
    };

    await internship.save();

    res.json({
        message: "Reminder set successfully",
        reminder: internship.reminder,
    });
};

// @route DELETE /api/internships/:id/reminder
export const clearReminder = async (req, res) => {
    const internship = await findOwned(req.params.id, req.user._id);

    internship.reminder = null;
    await internship.save();

    res.json({ message: "Reminder removed" });
};

// @route GET /api/internships/reminders/upcoming
export const getUpcomingReminders = async (req, res) => {
    const reminders = await Internship.find({
        user: req.user._id,
        "reminder.remindAt": { $gt: new Date() },
        status: { $in: REMINDER_STATUSES },
    })
        .select("_id company role status reminder")
        .sort({ "reminder.remindAt": 1 })
        .limit(4)
        .lean();

    res.json(reminders);
};

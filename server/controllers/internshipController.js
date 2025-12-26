import Internship from "../models/Internship.js"

// @route POST /api/internships
export const createInternship = async (req, res) => {
    const internship = await Internship.create({
        user: req.user._id,
        ...req.body,
    });

    res.status(201).json(internship);
};

// @route GET /api/internships
export const getInternships = async (req, res) => {
    const { page = 1, limit = 10, q = "", field = "", sortField = "", sortOrder = "asc" } = req.query;

    const query = { user: req.user._id };

    // If searching
    if (q) {
        const searchRegex = new RegExp(q, "i");
        if (field) {
            query[field.toLowerCase()] = searchRegex;
        } else {
            query.$or = [
                { company: searchRegex },
                { role: searchRegex },
                { status: searchRegex },
                { cycle: searchRegex },
            ];
        }
    }
    const skip = (page - 1) * limit

    const sortOptions = {};
    if (sortField) {
        sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;
    } else {
        sortOptions["createdAt"] = -1;
    }

    const cycleOrder = {
        Spring: 1,
        Summer: 2,
        Fall: 3,
        Winter: 4,
        "6-Month": 5,
    };

    const statusOrder = {
        Applied: 1,
        OA: 2,
        Interview: 3,
        Offer: 4,
        Rejected: 5,
    };

    const [data, total] = await Promise.all([
        Internship.aggregate([
            { $match: query },

            // Add custom sorting fields
            {
                $addFields: {
                    cycleSort: {
                        $switch: {
                            branches: Object.entries(cycleOrder).map(([key, val]) => ({
                                case: { $eq: ["$cycle", key] },
                                then: val
                            })),
                            default: 99
                        }
                    },
                    statusSort: {
                        $switch: {
                            branches: Object.entries(statusOrder).map(([key, val]) => ({
                                case: { $eq: ["$status", key] },
                                then: val
                            })),
                            default: 99
                        }
                    }
                }
            },

            // Now SORT depending on what sortField is
            {
                $sort: {
                    ...(sortField === "cycle"
                        ? { cycleSort: sortOrder === "asc" ? 1 : -1 }
                        : {}),
                    ...(sortField === "status"
                        ? { statusSort: sortOrder === "asc" ? 1 : -1 }
                        : {}),
                    ...(sortField === "appliedAt"
                        ? { appliedAt: sortOrder === "asc" ? 1 : -1 }
                        : {}),
                    // default fallback sort:
                    ...(sortField === ""
                        ? { createdAt: -1 }
                        : {})
                }
            },

            { $skip: skip },
            { $limit: parseInt(limit) }
        ]),
        Internship.countDocuments(query)
    ]);


    res.json({
        data,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
    });
};

// @route GET /api/internships/:id
export const getInternshipsById = async (req, res) => {
    const internship = await Internship.findOne({
        _id: req.params.id,
        user: req.user._id,
    }
    );

    if (!internship) {
        return res.status(404).json({ message: "Internship not found " });
    }

    return res.json(internship);
}

// @route PUT /api/internships/:id
export const updateInternship = async (req, res) => {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
    }
    if (internship.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }

    Object.assign(internship, req.body);

    // Enforce reminder rule
    if (
        req.body.status && !["OA", "Interview"].includes(req.body.status)
    ) {
        internship.reminder = null;
    }

    const updated = await internship.save();

    res.json(updated);
}

// @route DELETE /api/internships/:id
export const deleteInternship = async (req, res) => {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
    }
    if (internship.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }

    await internship.deleteOne();
    res.json({ message: "Internship removed" });
}


// @route PUT /api/internships/bulk-status
export const updateBulkStatus = async (req, res) => {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "No internships selected" });
    }

    const update = { status };

    // 🔒 Enforce reminder rule
    if (!["OA", "Interview"].includes(status)) {
        update.reminder = null;
    }

    await Internship.updateMany(
        { _id: { $in: ids }, user: req.user._id },
        { $set: update }

    );


    res.json({ message: "Status updated successfully" });
};

// @route PUT /api/internships/:id/reminder
export const setReminder = async (req, res) => {
    const { type, remindAt, location } = req.body;

    if (!type || !remindAt) {
        return res.status(400).json({ message: "Reminder type and time required" });
    }

    if (type === "Interview" && !location) {
        return res.status(400).json({
            message: "Interview location is required",
        })
    }

    if (!["OA", "Interview"].includes(type)) {
        return res.status(400).json({ message: "Invalid reminder type" });
    }

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }

    if (internship.status !== type) {
        return res.status(400).json({
            message: `Cannot set ${type} reminder when status is ${internship.status}`,
        });
    }

    const remindDate = new Date(remindAt);
    if (isNaN(remindDate.getTime())) {
        return res.status(400).json({ message: "Invalid reminder date" });
    }

    if (remindDate <= new Date()) {
        return res.status(400).json({ message: "Reminder must be in the future" })
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
    })
}

// @route DELETE /api/internships/:id/reminder
export const clearReminder = async (req, res) => {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }

    internship.reminder = null;
    await internship.save();

    res.json({ message: "Reminder removed" });
}

export const getUpcomingReminders = async(req, res) => {
    try {
        const now = new Date();

        const reminders = await Internship.find({
            user: req.user._id,
            "reminder.remindAt": { $gt: now },
            status: { $in: ["OA", "Interview"] },
        })
            .select("_id company role status reminder")
            .sort({"reminder.remindAt": 1})
            .limit(4)
            .lean();
        
        res.json(reminders);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch upcoming reminders",
        })
    }
}
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

// @route PUT /api/internships/:id
export const updateInternship = async (req, res) => {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
    }
    if (internship.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ mesage: "Not authorized" });
    }

    Object.assign(internship, req.body);
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

    await Internship.updateMany(
        { _id: { $in: ids }, user: req.user._id },
        { status }
    );

    res.json({ message: "Status updated successfully" });
};
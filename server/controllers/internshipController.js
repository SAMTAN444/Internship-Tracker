import Internship, { STATUSES, CYCLES, REMINDER_STATUSES, EDITABLE_FIELDS } from "../models/Internship.js"
import findOwned from "../utils/findOwned.js"
import HttpError from "../utils/HttpError.js"

const SEARCHABLE_FIELDS = ["company", "role", "status", "cycle"];
const MAX_LIMIT = 50;

const pick = (obj, keys) =>
    Object.fromEntries(keys.filter((k) => obj?.[k] !== undefined).map((k) => [k, obj[k]]));

// Search text is user input; escape it so it can't be a (slow) regex pattern.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Maps an enum field to its position in `values` so status/cycle sort in
// pipeline order instead of alphabetically.
const orderSwitch = (field, values) => ({
    $switch: {
        branches: values.map((value, i) => ({ case: { $eq: [`$${field}`, value] }, then: i })),
        default: 99,
    },
});

// @route POST /api/internships
export const createInternship = async (req, res) => {
    const internship = await Internship.create({
        ...pick(req.body, EDITABLE_FIELDS),
        user: req.user._id,
    });

    res.status(201).json(internship);
};

// @route GET /api/internships
export const getInternships = async (req, res) => {
    const {
        q = "",
        field = "",
        sortField = "",
        sortOrder = "asc",
        scope = "active", // "active" | "archived"
    } = req.query;

    const pageNum = Math.max(1, parseInt(req.query.page) || 1);
    const limitNum = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit) || 10));

    // active = everything except Archived, archived = only Archived
    const query = {
        user: req.user._id,
        status: scope === "archived" ? "Archived" : { $ne: "Archived" },
    };

    if (q) {
        const searchRegex = new RegExp(escapeRegex(String(q)), "i");
        const searchField = String(field).toLowerCase();

        if (SEARCHABLE_FIELDS.includes(searchField)) {
            query[searchField] = searchRegex;
        } else {
            query.$or = SEARCHABLE_FIELDS.map((f) => ({ [f]: searchRegex }));
        }
    }

    const direction = sortOrder === "asc" ? 1 : -1;
    const sortStage = {
        cycle: { cycleSort: direction },
        status: { statusSort: direction },
        appliedAt: { appliedAt: direction },
    }[sortField] || { createdAt: -1 };

    const [data, total] = await Promise.all([
        Internship.aggregate([
            { $match: query },
            {
                $addFields: {
                    cycleSort: orderSwitch("cycle", CYCLES),
                    statusSort: orderSwitch("status", STATUSES),
                },
            },
            { $sort: sortStage },
            { $skip: (pageNum - 1) * limitNum },
            { $limit: limitNum },
        ]),
        Internship.countDocuments(query),
    ]);

    res.json({
        data,
        total,
        page: pageNum,
        limit: limitNum,
    });
};

// @route GET /api/internships/:id
export const getInternshipsById = async (req, res) => {
    res.json(await findOwned(req.params.id, req.user._id));
};

// @route PUT /api/internships/:id
export const updateInternship = async (req, res) => {
    const internship = await findOwned(req.params.id, req.user._id);

    Object.assign(internship, pick(req.body, EDITABLE_FIELDS));

    // Reminders only make sense for OA/Interview
    if (req.body.status && !REMINDER_STATUSES.includes(req.body.status)) {
        internship.reminder = null;
    }

    res.json(await internship.save());
};

// @route DELETE /api/internships/:id
export const deleteInternship = async (req, res) => {
    const internship = await findOwned(req.params.id, req.user._id);
    await internship.deleteOne();
    res.json({ message: "Internship removed" });
};

// @route PUT /api/internships/bulk-status
export const updateBulkStatus = async (req, res) => {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        throw new HttpError(400, "No internships selected");
    }
    // updateMany skips schema validation, so check the enum here.
    if (!STATUSES.includes(status)) {
        throw new HttpError(400, "Invalid status");
    }

    const update = { status };
    if (!REMINDER_STATUSES.includes(status)) {
        update.reminder = null;
    }

    await Internship.updateMany(
        { _id: { $in: ids }, user: req.user._id },
        { $set: update }
    );

    res.json({ message: "Status updated successfully" });
};

// @route GET /api/internships/stats
// Pipeline counts for the dashboard. Active applications only, so archiving
// last season resets the picture.
export const getStats = async (req, res) => {
    const groups = await Internship.aggregate([
        { $match: { user: req.user._id, status: { $ne: "Archived" } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byStatus = Object.fromEntries(
        STATUSES.filter((s) => s !== "Archived").map((s) => [s, 0])
    );
    for (const { _id, count } of groups) byStatus[_id] = count;

    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

    res.json({
        total,
        byStatus,
        // Anything past "Applied" means the company responded
        heardBack: total - byStatus.Applied,
        offers: byStatus.Offer,
    });
};

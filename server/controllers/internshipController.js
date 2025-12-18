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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page-1) * limit

    const total = await Internship.countDocuments({ user: req.user._id });


    const internships = await Internship.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    res.json({
        data: internships,
        total,
        page,
        limit,
    });
};

// @route PUT /api/internships/:id
export const updateInternship = async (req,res) => {
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
        { _id: { $in: ids }, user: req.user._id},
        { status }
    );

    res.json({ message: "Status updated successfully" });
};
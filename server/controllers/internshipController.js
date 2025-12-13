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
    const internships = await Internship.find({ user: req.user._id });
    res.json(internships);
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

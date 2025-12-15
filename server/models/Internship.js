import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema (
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Applied", "OA", "Interview", "Offer", "Rejected"],
            default: "Applied",
        },
        cycle: {
            type: String,
            enum: ["Spring", "Summer", "Fall", "Winter", "SixMonth"],
            required: true,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
        },
    },
    {timestamps: true }
);

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship;
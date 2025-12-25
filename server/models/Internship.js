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
            enum: ["Spring", "Summer", "Fall", "Winter", "6-Month"],
            required: true,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        applicationLink: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
        },
        reminder: {
            type: {
                type: String,
                enum: ["OA", "Interview"],
            },
            remindAt: Date,
        }
    },
    {timestamps: true }
);

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship;
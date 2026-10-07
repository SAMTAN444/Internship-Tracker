import mongoose from "mongoose";

// Pipeline order. Also drives the custom sort in getInternships.
export const STATUSES = ["Applied", "OA", "Interview", "Offer", "Rejected", "Archived"];
export const CYCLES = ["Spring", "Summer", "Fall", "Winter", "6-Month"];

// Only these statuses can carry a reminder; moving to any other clears it.
export const REMINDER_STATUSES = ["OA", "Interview"];

// Fields a client may set on create/update. Anything else in the body
// (user, _id, reminder, timestamps) is ignored.
export const EDITABLE_FIELDS = ["company", "role", "status", "cycle", "appliedAt", "applicationLink", "notes"];

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
            enum: STATUSES,
            default: "Applied",
        },
        cycle: {
            type: String,
            enum: CYCLES,
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
                enum: REMINDER_STATUSES,
            },
            remindAt: Date,

            location: {
                type: String,
                trim: true,
            }
        }
    },
    {timestamps: true }
);

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship;
import mongoose from "mongoose"

// One entry per active session. Only the SHA-256 hash is stored, so a leaked
// database dump can't be replayed against /api/auth/refresh.
const refreshTokenSchema = new mongoose.Schema(
    {
        tokenHash: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        // Set when the token is rotated away. Kept around briefly so two tabs
        // refreshing at the same moment don't log each other out.
        usedAt: {
            type: Date,
            default: null,
        },
    },
    { _id: false, timestamps: true }
);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshTokens: {
            type: [refreshTokenSchema],
            default: [],
            select: false,
        },
    },
    { timestamps: true }
);

userSchema.index({ "refreshTokens.tokenHash": 1 });

const User = mongoose.model("User", userSchema);
export default User;

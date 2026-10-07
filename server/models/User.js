import mongoose from "mongoose"

// Credentials and sessions live in Firebase Auth. This is the app-side profile
// that internships hang off, linked by the Firebase uid.
const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        // Display name only; login is by email.
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

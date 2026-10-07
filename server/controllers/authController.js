import User from "../models/User.js"
import HttpError from "../utils/HttpError.js"

const USERNAME_RULE = /^[A-Za-z0-9_.-]{3,30}$/;

const validateUsername = (raw) => {
    const username = String(raw ?? "").trim();
    if (!USERNAME_RULE.test(username)) {
        throw new HttpError(
            400,
            "Username must be 3–30 characters: letters, numbers, dots, dashes or underscores",
            "USERNAME_INVALID"
        );
    }
    return username;
};

const profileResponse = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
});

// @route GET /api/auth/username-available?username=
// Checked before creating the Firebase account so a taken name fails early.
export const usernameAvailable = async (req, res) => {
    const username = validateUsername(req.query.username);
    const taken = await User.exists({ username });
    res.json({ available: !taken });
};

// @route POST /api/auth/profile
// Second half of sign-up: the client has already created the Firebase account
// and sends its ID token. Safe to retry; an existing profile is returned as-is.
export const createProfile = async (req, res) => {
    const { uid, email } = req.firebase;

    const existing = await User.findOne({ firebaseUid: uid });
    if (existing) return res.json(profileResponse(existing));

    const username = validateUsername(req.body.username);

    try {
        const user = await User.create({ firebaseUid: uid, email, username });
        res.status(201).json(profileResponse(user));
    } catch (error) {
        // Unique index on username (also covers two sign-ups racing for one name)
        if (error.code === 11000) {
            throw new HttpError(409, "That username is taken", "USERNAME_TAKEN");
        }
        throw error;
    }
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
    res.json(profileResponse(req.user));
};

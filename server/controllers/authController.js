import crypto from "node:crypto"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Access tokens are short-lived because they live in localStorage and can't be
// revoked. Refresh tokens are long-lived but are stored (hashed) server-side,
// so logging out or detecting a leak actually kills the session.
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// How long an already-rotated refresh token keeps working. Without this, two
// tabs refreshing in the same instant would race and one would be logged out.
const REFRESH_GRACE_MS = 5 * 60 * 1000;

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_TTL,
    });
};

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

// Drops expired sessions and rotated tokens that are past the grace window, so
// the array doesn't grow without bound.
const pruneRefreshTokens = (user) => {
    const now = Date.now();
    user.refreshTokens = user.refreshTokens.filter(
        (entry) =>
            entry.expiresAt.getTime() > now &&
            (!entry.usedAt || now - entry.usedAt.getTime() <= REFRESH_GRACE_MS)
    );
};

const issueRefreshToken = async (user) => {
    const refreshToken = crypto.randomBytes(48).toString("hex");

    user.refreshTokens.push({
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });
    pruneRefreshTokens(user);
    await user.save();

    return refreshToken;
};

const sessionResponse = async (user) => ({
    _id: user._id,
    username: user.username,
    token: generateAccessToken(user._id),
    refreshToken: await issueRefreshToken(user),
});

const isStrongPassword = (password) => {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (typeof password !== "string") {
            return res.status(400).json({ message: "Password must be a string" });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
            });
        }

        if (typeof username !== "string" || username.trim().length < 3) {
            return res.status(400).json({
                message: "Username must be at least 3 characters long",
            });
        }

        const userExists = await User.findOne({ username: username.trim() });
        if (userExists) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username.trim(),
            password: hashedPassword,
        });

        res.status(201).json(await sessionResponse(user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// @route POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            username: (username || "").trim(),
        }).select("+refreshTokens");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json(await sessionResponse(user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @route POST /api/auth/refresh
// Trades a valid refresh token for a fresh access token, rotating the refresh
// token as it goes. Deliberately unauthenticated: the whole point is that the
// caller's access token has already expired.
export const refreshSession = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken || typeof refreshToken !== "string") {
            return res.status(401).json({
                message: "Session expired, please log in again",
                code: "REFRESH_MISSING",
            });
        }

        const tokenHash = hashToken(refreshToken);
        const user = await User.findOne({
            "refreshTokens.tokenHash": tokenHash,
        }).select("+refreshTokens");

        if (!user) {
            return res.status(401).json({
                message: "Session expired, please log in again",
                code: "REFRESH_INVALID",
            });
        }

        const entry = user.refreshTokens.find((e) => e.tokenHash === tokenHash);
        const now = Date.now();

        if (entry.expiresAt.getTime() <= now) {
            pruneRefreshTokens(user);
            await user.save();
            return res.status(401).json({
                message: "Session expired, please log in again",
                code: "REFRESH_EXPIRED",
            });
        }

        // Rotated long ago but presented again: assume it leaked and drop every
        // session for this user rather than hand out a new one.
        if (entry.usedAt && now - entry.usedAt.getTime() > REFRESH_GRACE_MS) {
            user.refreshTokens = [];
            await user.save();
            return res.status(401).json({
                message: "Session expired, please log in again",
                code: "REFRESH_REUSED",
            });
        }

        if (!entry.usedAt) {
            entry.usedAt = new Date();
        }

        res.json(await sessionResponse(user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @route POST /api/auth/logout
export const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken && typeof refreshToken === "string") {
            await User.updateOne(
                { "refreshTokens.tokenHash": hashToken(refreshToken) },
                { $pull: { refreshTokens: { tokenHash: hashToken(refreshToken) } } }
            );
        }

        res.json({ message: "Logged out" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
    });
}

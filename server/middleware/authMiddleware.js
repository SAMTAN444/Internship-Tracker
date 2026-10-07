import { adminAuth } from "../config/firebase.js"
import User from "../models/User.js"
import HttpError from "../utils/HttpError.js"

// Verifies the Firebase ID token in the Authorization header. Throws a 401
// carrying a code the client uses to decide whether to retry with a fresh token.
const verifyToken = async (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new HttpError(401, "Not authorized, no token", "TOKEN_MISSING");
    }

    // Outside the try: a missing service account is a server bug, not a bad token.
    const auth = adminAuth();

    try {
        return await auth.verifyIdToken(authHeader.split(" ")[1]);
    } catch (error) {
        const code = error.code === "auth/id-token-expired" ? "TOKEN_EXPIRED" : "TOKEN_INVALID";
        throw new HttpError(401, "Not authorized, token failed", code);
    }
};

// Signed in with Firebase AND has a Trackly profile. Sets req.user to the Mongo doc.
export const protect = async (req, res, next) => {
    const decoded = await verifyToken(req);

    req.user = await User.findOne({ firebaseUid: decoded.uid });

    // Firebase account exists but sign-up never finished creating the profile.
    if (!req.user) {
        throw new HttpError(401, "Profile not set up", "PROFILE_MISSING");
    }

    next();
};

// Signed in with Firebase, profile optional. Only used to create the profile.
export const verifyFirebase = async (req, res, next) => {
    req.firebase = await verifyToken(req);
    next();
};

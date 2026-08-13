import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized, no token", code: "TOKEN_MISSING" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found", code: "USER_NOT_FOUND" });
        }

        next();

    } catch(error) {
        // The client uses this code to decide whether to attempt a refresh or
        // to give up and send the user back to the login page.
        const code = error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "TOKEN_INVALID";
        return res.status(401).json({ message: "Not authorized, token failed", code });
    }
}
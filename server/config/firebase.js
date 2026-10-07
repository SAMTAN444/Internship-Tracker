import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Initialised on first use rather than at import time: ES module imports run
// before server.js gets to call dotenv.config(), so the env isn't loaded yet.
export const adminAuth = () => {
    if (!getApps().length) {
        const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        if (!encoded) {
            throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is not set");
        }
        const serviceAccount = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
        initializeApp({ credential: cert(serviceAccount) });
    }
    return getAuth();
};

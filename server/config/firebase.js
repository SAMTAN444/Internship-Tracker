import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Initialised on first use rather than at import time: ES module imports run
// before server.js gets to call dotenv.config(), so the env isn't loaded yet.
export const adminAuth = () => {
    if (!getApps().length) {
        // Tests run against the local Firebase Auth Emulator. The Admin SDK
        // switches to it automatically when FIREBASE_AUTH_EMULATOR_HOST is set,
        // and needs only a project id, not a real service account.
        if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
            initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "demo-trackly" });
            return getAuth();
        }
        const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        if (!encoded) {
            throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is not set");
        }
        const serviceAccount = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
        initializeApp({ credential: cert(serviceAccount) });
    }
    return getAuth();
};

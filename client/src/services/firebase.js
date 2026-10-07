import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

// Firebase keeps the session in IndexedDB and refreshes ID tokens itself.
export const auth = getAuth(app);

// Where the "Continue" button in verification/reset emails sends people.
export const emailActionSettings = () => ({ url: `${window.location.origin}/login` });

const MESSAGES = {
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/user-not-found": "Email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
    "auth/weak-password": "Password must be at least 8 characters with upper and lower case letters, a number and a symbol.",
    "auth/password-does-not-meet-requirements":
        "Password must be at least 8 characters with upper and lower case letters, a number and a symbol.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
    "auth/network-request-failed": "Can't reach the sign-in service. Check your connection and try again.",
    "auth/user-disabled": "This account has been disabled.",
};

// Turns a Firebase or API error into something a person can act on.
export const authErrorMessage = (err, fallback = "Something went wrong. Please try again.") =>
    MESSAGES[err?.code] || err?.response?.data?.message || fallback;

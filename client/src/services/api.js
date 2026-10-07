import axios from "axios"
import { signOut } from "firebase/auth"
import { auth } from "./firebase"

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://internship-tracker-api.onrender.com",
});

// Attach the Firebase ID token. getIdToken() returns the cached token and only
// hits the network when it's about to expire.
API.interceptors.request.use(async (req) => {
    // On a fresh page load Firebase restores the session asynchronously.
    await auth.authStateReady();
    const token = await auth.currentUser?.getIdToken();
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const { response, config } = error;

        // No response at all means the network failed or Render is cold-starting.
        // That is NOT an auth problem, so leave the session alone and let the
        // caller show a retry state.
        if (!response || !config || response.status !== 401) return Promise.reject(error);

        // Signed in, but sign-up never created the Trackly profile. AuthContext
        // handles this by sending the user to finish registering.
        if (response.data?.code === "PROFILE_MISSING") return Promise.reject(error);

        const user = auth.currentUser;
        if (!user) return Promise.reject(error);

        // One retry with a force-refreshed token covers clock skew and tokens
        // that expired between the cache check and the request.
        if (!config._retried) {
            config._retried = true;
            try {
                const token = await user.getIdToken(true);
                config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
                return API(config);
            } catch {
                // Refresh failed: account deleted/disabled or session revoked.
            }
        }

        await signOut(auth);
        return Promise.reject(error);
    }
);

export default API;

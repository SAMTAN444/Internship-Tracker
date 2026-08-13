import axios from "axios"

const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

// Fired whenever the stored session changes, so App can re-render its routes.
// The native `storage` event only fires in *other* tabs, which is why the old
// code never noticed same-tab logins.
export const AUTH_CHANGED = "auth:changed";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://internship-tracker-api.onrender.com",
});

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setSession = ({ token, refreshToken }) => {
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    window.dispatchEvent(new Event(AUTH_CHANGED));
};

export const clearSession = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED));
};

// Tell the server to forget this refresh token, then drop it locally. Best
// effort: a failed request must not leave the user stuck on a logged-in shell.
export const endSession = async () => {
    const refreshToken = getRefreshToken();
    try {
        if (refreshToken) await API.post("/api/auth/logout", { refreshToken });
    } catch {
        // ignore — clearing locally is what actually matters
    } finally {
        clearSession();
    }
};

// Attach token automatically if it exists
API.interceptors.request.use((req) => {
    const token = getAccessToken();
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Requests that must never trigger a refresh attempt: a 401 from these means
// bad credentials or a dead refresh token, not an expired access token.
const NO_REFRESH_PATHS = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
    "/api/auth/logout",
];

// Single-flight: if several requests 401 at once they all await the same
// refresh instead of each burning (and rotating away) the refresh token.
let refreshPromise = null;

const refreshAccessToken = () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return Promise.resolve(null);

    if (!refreshPromise) {
        // Bare axios, not API — going through the instance would re-enter this
        // interceptor and recurse if the refresh itself 401s.
        refreshPromise = axios
            .post(`${API.defaults.baseURL}/api/auth/refresh`, { refreshToken })
            .then(({ data }) => {
                setSession({ token: data.token, refreshToken: data.refreshToken });
                return data.token;
            })
            .catch(() => null)
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const { response, config } = error;

        // No response at all means the network failed or Render is cold-starting.
        // That is NOT an auth problem, so leave the session alone and let the
        // caller show a retry state.
        if (!response || !config) return Promise.reject(error);

        const isRetryable =
            response.status === 401 &&
            !config._retried &&
            !NO_REFRESH_PATHS.some((path) => (config.url || "").includes(path));

        if (!isRetryable) {
            if (response.status === 401) clearSession();
            return Promise.reject(error);
        }

        config._retried = true;

        const token = await refreshAccessToken();
        if (!token) {
            clearSession();
            return Promise.reject(error);
        }

        config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
        return API(config);
    }
);

export default API;

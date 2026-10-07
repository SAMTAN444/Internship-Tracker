import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../services/firebase";
import API from "../services/api";

const AuthContext = createContext(null);

// Session state for the whole app:
//   user           Firebase user (null when signed out)
//   profile        Trackly profile from /api/auth/me ({ _id, username, email })
//   profileStatus  "idle" (signed out) | "loading" | "ready"
//                  | "missing" (signed in, but sign-up never created the profile)
//                  | "error" (API unreachable, e.g. Render cold start; see profileError)
//   initializing   true only until the first session restore finishes, so a
//                  page refresh doesn't flash the login screen
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profileStatus, setProfileStatus] = useState("idle");
    const [profileError, setProfileError] = useState(null);
    const [initializing, setInitializing] = useState(true);

    // Ignore responses from a /me call that a newer one has superseded
    const requestId = useRef(0);

    const refreshProfile = useCallback(async () => {
        const id = ++requestId.current;
        setProfileStatus("loading");
        setProfileError(null);
        try {
            const { data } = await API.get("/api/auth/me");
            if (id !== requestId.current) return;
            setProfile(data);
            setProfileStatus("ready");
        } catch (err) {
            if (id !== requestId.current) return;
            setProfile(null);
            if (err.response?.data?.code === "PROFILE_MISSING") {
                setProfileStatus("missing");
            } else if (err.response?.status === 401) {
                // The API interceptor has already signed out; onAuthStateChanged resets state.
                setProfileStatus("idle");
            } else {
                setProfileStatus("error");
                setProfileError(
                    err.response
                        ? "Couldn't load your account. Please try again."
                        : "Can't reach the server. It may be waking up, which can take up to a minute."
                );
            }
        } finally {
            if (id === requestId.current) setInitializing(false);
        }
    }, []);

    useEffect(
        () =>
            onAuthStateChanged(auth, (firebaseUser) => {
                setUser(firebaseUser);
                setEmailVerified(!!firebaseUser?.emailVerified);
                if (firebaseUser) {
                    refreshProfile();
                } else {
                    requestId.current++;
                    setProfile(null);
                    setProfileStatus("idle");
                    setProfileError(null);
                    setInitializing(false);
                }
            }),
        [refreshProfile]
    );

    const signOut = useCallback(() => firebaseSignOut(auth), []);

    // Firebase only learns about a verified email after a reload.
    const reloadUser = useCallback(async () => {
        if (!auth.currentUser) return false;
        await auth.currentUser.reload();
        const verified = auth.currentUser.emailVerified;
        setEmailVerified(verified);
        return verified;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                emailVerified,
                profile,
                profileStatus,
                profileError,
                initializing,
                signOut,
                reloadUser,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "trackly-theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

const readPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || "system";
  } catch {
    return "system"; // storage blocked (private mode etc.)
  }
};

const resolveTheme = (preference) =>
  preference === "system" ? (media().matches ? "dark" : "light") : preference;

const ThemeContext = createContext(null);

// preference: what the user picked ("system" | "light" | "dark")
// theme:      what's actually showing ("light" | "dark")
export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(readPreference);
  const [theme, setTheme] = useState(() => resolveTheme(readPreference()));

  useEffect(() => {
    const apply = () => {
      const next = resolveTheme(preference);
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    };
    apply();
    if (preference !== "system") return;
    // Follow the OS live while on "system"
    const mq = media();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [preference]);

  const setPreference = useCallback((value) => {
    setPreferenceState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Not persisted; still applies for this session
    }
  }, []);

  return <ThemeContext.Provider value={{ preference, theme, setPreference }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

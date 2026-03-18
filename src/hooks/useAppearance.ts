import { useState, useEffect, useCallback } from "react";

export type AccentGradient = "blue" | "green" | "purple" | "orange" | "red" | "dark" | "midnight" | "sky" | "teal" | "indigo" | "rosegold" | "amber" | "classicred" | "crimson";

export const GRADIENT_OPTIONS: { key: AccentGradient; label: string; from: string; to: string; classes: string; primaryHsl: string; primaryDarkHsl: string; ringHsl: string }[] = [
  { key: "blue", label: "Blau", from: "#2563eb", to: "#1e40af", classes: "from-blue-600 to-blue-800", primaryHsl: "211 72% 37%", primaryDarkHsl: "211 72% 50%", ringHsl: "211 72% 37%" },
  { key: "green", label: "Grün", from: "#10b981", to: "#0f766e", classes: "from-emerald-500 to-teal-700", primaryHsl: "160 84% 39%", primaryDarkHsl: "160 84% 49%", ringHsl: "160 84% 39%" },
  { key: "purple", label: "Lila", from: "#9333ea", to: "#6d28d9", classes: "from-purple-600 to-violet-800", primaryHsl: "271 81% 56%", primaryDarkHsl: "271 81% 63%", ringHsl: "271 81% 56%" },
  { key: "orange", label: "Orange", from: "#f97316", to: "#dc2626", classes: "from-orange-500 to-red-600", primaryHsl: "25 95% 53%", primaryDarkHsl: "25 95% 60%", ringHsl: "25 95% 53%" },
  { key: "red", label: "Rot", from: "#f43f5e", to: "#be185d", classes: "from-rose-500 to-pink-700", primaryHsl: "350 89% 60%", primaryDarkHsl: "350 89% 67%", ringHsl: "350 89% 60%" },
  { key: "dark", label: "Dunkel", from: "#374151", to: "#111827", classes: "from-gray-700 to-gray-900", primaryHsl: "218 11% 35%", primaryDarkHsl: "218 11% 50%", ringHsl: "218 11% 35%" },
  { key: "midnight", label: "Midnight", from: "#1e293b", to: "#020617", classes: "from-slate-800 to-slate-950", primaryHsl: "217 33% 17%", primaryDarkHsl: "217 33% 35%", ringHsl: "217 33% 17%" },
  { key: "sky", label: "Sky", from: "#38bdf8", to: "#0891b2", classes: "from-sky-400 to-cyan-600", primaryHsl: "199 89% 48%", primaryDarkHsl: "199 89% 58%", ringHsl: "199 89% 48%" },
  { key: "teal", label: "Teal", from: "#14b8a6", to: "#047857", classes: "from-teal-500 to-emerald-700", primaryHsl: "173 80% 40%", primaryDarkHsl: "173 80% 50%", ringHsl: "173 80% 40%" },
  { key: "indigo", label: "Indigo", from: "#6366f1", to: "#3730a3", classes: "from-indigo-500 to-indigo-800", primaryHsl: "239 84% 67%", primaryDarkHsl: "239 84% 74%", ringHsl: "239 84% 67%" },
  { key: "rosegold", label: "Rose Gold", from: "#fb7185", to: "#db2777", classes: "from-rose-400 to-pink-600", primaryHsl: "350 89% 55%", primaryDarkHsl: "350 89% 65%", ringHsl: "350 89% 55%" },
  { key: "amber", label: "Amber", from: "#fbbf24", to: "#ea580c", classes: "from-amber-400 to-orange-600", primaryHsl: "38 92% 50%", primaryDarkHsl: "38 92% 58%", ringHsl: "38 92% 50%" },
  { key: "classicred", label: "Red", from: "#ef4444", to: "#be123c", classes: "from-red-500 to-rose-700", primaryHsl: "0 84% 60%", primaryDarkHsl: "0 84% 67%", ringHsl: "0 84% 60%" },
  { key: "crimson", label: "Crimson", from: "#b91c1c", to: "#450a0a", classes: "from-red-700 to-red-950", primaryHsl: "0 72% 41%", primaryDarkHsl: "0 72% 55%", ringHsl: "0 72% 41%" },
];

const LS_DARK = "app-dark-mode";
const LS_GRADIENT = "app-accent-gradient";
const LS_LOGO = "app-custom-logo";

export function useAppearance() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(LS_DARK) === "true");
  const [accent, setAccent] = useState<AccentGradient>(() => (localStorage.getItem(LS_GRADIENT) as AccentGradient) || "blue");
  const [logo, setLogo] = useState<string | null>(() => localStorage.getItem(LS_LOGO));

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(LS_DARK, String(darkMode));
  }, [darkMode]);

  // Apply accent gradient + override primary color globally
  useEffect(() => {
    const opt = GRADIENT_OPTIONS.find((g) => g.key === accent) || GRADIENT_OPTIONS[0];
    const root = document.documentElement;
    root.style.setProperty("--accent-from", opt.from);
    root.style.setProperty("--accent-to", opt.to);
    // Override the primary color system so all buttons, badges, rings, links pick up the accent
    root.style.setProperty("--primary", opt.primaryHsl);
    root.style.setProperty("--ring", opt.ringHsl);
    root.style.setProperty("--sidebar-primary", opt.primaryHsl);
    root.style.setProperty("--sidebar-ring", opt.ringHsl);
    // Accent tints for hover states / backgrounds
    root.style.setProperty("--accent-foreground", opt.primaryHsl);
    root.style.setProperty("--sidebar-accent-foreground", opt.primaryHsl);
    localStorage.setItem(LS_GRADIENT, accent);
  }, [accent]);

  // Re-apply primary overrides when dark mode changes
  useEffect(() => {
    const opt = GRADIENT_OPTIONS.find((g) => g.key === accent) || GRADIENT_OPTIONS[0];
    const root = document.documentElement;
    const hsl = darkMode ? opt.primaryDarkHsl : opt.primaryHsl;
    root.style.setProperty("--primary", hsl);
    root.style.setProperty("--ring", hsl);
    root.style.setProperty("--sidebar-primary", hsl);
    root.style.setProperty("--sidebar-ring", hsl);
  }, [darkMode, accent]);

  // Logo
  useEffect(() => {
    if (logo) {
      localStorage.setItem(LS_LOGO, logo);
    } else {
      localStorage.removeItem(LS_LOGO);
    }
  }, [logo]);

  const uploadLogo = useCallback((file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo darf maximal 2 MB groß sein.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeLogo = useCallback(() => setLogo(null), []);

  const gradientStyle = {
    background: `linear-gradient(135deg, var(--accent-from, #2563eb), var(--accent-to, #1e40af))`,
  };

  const gradientClass = GRADIENT_OPTIONS.find((g) => g.key === accent)?.classes || GRADIENT_OPTIONS[0].classes;

  return {
    darkMode,
    setDarkMode,
    accent,
    setAccent,
    logo,
    uploadLogo,
    removeLogo,
    gradientStyle,
    gradientClass,
  };
}

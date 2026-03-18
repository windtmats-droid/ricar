import { useState, useEffect, useCallback } from "react";

export type AccentGradient = "blue" | "green" | "purple" | "orange" | "red" | "dark";

export const GRADIENT_OPTIONS: { key: AccentGradient; label: string; from: string; to: string; classes: string }[] = [
  { key: "blue", label: "Blau", from: "#2563eb", to: "#1e40af", classes: "from-blue-600 to-blue-800" },
  { key: "green", label: "Grün", from: "#10b981", to: "#0f766e", classes: "from-emerald-500 to-teal-700" },
  { key: "purple", label: "Lila", from: "#9333ea", to: "#6d28d9", classes: "from-purple-600 to-violet-800" },
  { key: "orange", label: "Orange", from: "#f97316", to: "#dc2626", classes: "from-orange-500 to-red-600" },
  { key: "red", label: "Rot", from: "#f43f5e", to: "#be185d", classes: "from-rose-500 to-pink-700" },
  { key: "dark", label: "Dunkel", from: "#374151", to: "#111827", classes: "from-gray-700 to-gray-900" },
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

  // Apply accent gradient as CSS custom properties
  useEffect(() => {
    const opt = GRADIENT_OPTIONS.find((g) => g.key === accent) || GRADIENT_OPTIONS[0];
    document.documentElement.style.setProperty("--accent-from", opt.from);
    document.documentElement.style.setProperty("--accent-to", opt.to);
    localStorage.setItem(LS_GRADIENT, accent);
  }, [accent]);

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

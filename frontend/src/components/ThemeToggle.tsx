"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function setStoredTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setStoredTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 3a9 9 0 1 0 9 9c0-.35-.02-.7-.05-1.04A7 7 0 0 1 12 3Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 4.5V2m0 20v-2.5M4.5 12H2m20 0h-2.5M5.6 5.6 3.9 3.9m16.2 16.2-1.7-1.7M5.6 18.4 3.9 20.1M20.1 3.9l-1.7 1.7M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
        </svg>
      )}
    </button>
  );
}

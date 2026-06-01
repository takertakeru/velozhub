/**
 * Shared VelozHub brand assets and theming helper.
 *
 * The Veloz design system (`veloz.css`, the car photo, the brand mark) is used
 * across the app: the booking screens, the public landing, and the login. It
 * lives here, outside any single feature, so nothing has to reach into another
 * feature to render the brand.
 */
import type { SVGProps } from "react";

export { default as velozCarUrl } from "./veloz-car.png";

/** Brand mark: a stylized speed "V" inside a rounded square. */
export function VelozMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <rect x={1} y={1} width={30} height={30} rx={9} fill="var(--primary)" />
      <path
        d="M9 10.5l4.6 11a1.2 1.2 0 0 0 2.2 0l4.6-11"
        stroke="var(--primary-ink)"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M21.5 10.5h2.2"
        stroke="var(--accent)"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export type VelozTheme = "light" | "dark";

const THEME_KEY = "veloz-theme";

function readStoredTheme(): VelozTheme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);

    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

/**
 * Initial theme for a Veloz surface, shared across login, the landing, and the
 * app so the look stays consistent through sign-in and sign-out. Prefers a
 * previously chosen theme (localStorage), then the document `.dark` class, then
 * the OS preference, defaulting to light. Client-only SPA, so `document` and
 * `window` are always available.
 */
export function initialVelozTheme(): VelozTheme {
  const stored = readStoredTheme();

  if (stored) {
    return stored;
  }
  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Remember the user's theme choice so every Veloz surface agrees on it. */
export function persistVelozTheme(theme: VelozTheme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    return;
  }
}

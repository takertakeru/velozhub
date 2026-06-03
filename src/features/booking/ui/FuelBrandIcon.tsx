import { useState } from "react";
import type { FuelBrand } from "@/libs/supabase/types";

/**
 * Brand mark for a gas station.
 *
 * If an official logo file exists at `./brand-logos/<slug>.(svg|png|webp)` it is
 * rendered; otherwise we fall back to a colored tile with the brand initial. The
 * logos themselves are NOT shipped in the repo: they are trademarks of their
 * owners, so the household drops its own licensed asset files into `brand-logos/`
 * (see the README there) and they appear automatically, no code change needed.
 */

type Mark = { bg: string; fg: string; label: string; slug: string };

const brandMarks: Record<FuelBrand, Mark> = {
  Petron: { bg: "#E2231A", fg: "#ffffff", label: "P", slug: "petron" },
  Shell: { bg: "#FBCE07", fg: "#D42E12", label: "S", slug: "shell" },
  Caltex: { bg: "#E11A2C", fg: "#ffffff", label: "C", slug: "caltex" },
  Phoenix: { bg: "#E0451E", fg: "#ffffff", label: "P", slug: "phoenix" },
  Seaoil: { bg: "#0046AD", fg: "#ffffff", label: "S", slug: "seaoil" },
  Unioil: { bg: "#1B3A8C", fg: "#ffffff", label: "U", slug: "unioil" },
  Jetti: { bg: "#009A44", fg: "#ffffff", label: "J", slug: "jetti" },
  Others: { bg: "#64748b", fg: "#ffffff", label: "?", slug: "" },
};

// Resolved at build time: only files that actually exist become entries, so a
// missing logo silently uses the tile fallback (and there are no 404s).
const logoModules = import.meta.glob<string>(
  "./brand-logos/*.{svg,png,webp}",
  { eager: true, query: "?url", import: "default" },
);
const logoBySlug: Record<string, string> = Object.fromEntries(
  Object.entries(logoModules).map(([path, url]) => {
    const file = path.slice(path.lastIndexOf("/") + 1);

    return [file.replace(/\.\w+$/, ""), url];
  }),
);

export function FuelBrandIcon({
  brand,
  size = 24,
}: {
  brand: FuelBrand;
  size?: number;
}) {
  const m = brandMarks[brand];
  const [hasFailed, setHasFailed] = useState(false);
  const logo = m.slug ? logoBySlug[m.slug] : undefined;

  if (logo && !hasFailed) {
    return (
      <img
        className="brand-logo"
        src={logo}
        alt={brand}
        style={{ width: size, height: size }}
        onError={() => { setHasFailed(true); }}
      />
    );
  }

  return (
    <span
      className="brand-icon"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: m.bg,
        color: m.fg,
        fontSize: Math.round(size * 0.46),
      }}
    >
      {m.label}
    </span>
  );
}

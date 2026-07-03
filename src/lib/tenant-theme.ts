import type { Tenant } from "@/lib/types";
import { TENANT_THEME_PRESETS } from "@/lib/tenant-config";

/**
 * A tenant theme is a flat map of CSS custom properties. It overrides the
 * TAV-derived defaults in globals.css (which double as the product-neutral
 * fallback for the login page and any tenant without a preset).
 */
export type TenantTheme = Record<string, string>;

// ── Color helpers (hex in, hex out) ─────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

/** Mix `color` into `base` by `amount` (0 = base, 1 = color). */
export function mix(base: string, color: string, amount: number): string {
  const a = hexToRgb(base);
  const b = hexToRgb(color);
  return rgbToHex([
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  ]);
}

const tint = (color: string, amount: number) => mix("#ffffff", color, amount);
const shade = (color: string, amount: number) => mix(color, "#000000", amount);

/**
 * Derive a full theme from the color columns on a tenants row. Used for
 * tenants without a hand-tuned preset in tenant-config.ts, so a new tenant
 * gets a coherent look from just five colors.
 */
export function deriveTheme(tenant: Tenant): TenantTheme {
  const primary = tenant.primary_color;
  const secondary = tenant.secondary_color;
  const accent = tenant.accent_color;
  const bg = tenant.background_color;
  const text = tenant.text_color;
  return {
    "--background": bg,
    "--foreground": text,
    "--card": "#ffffff",
    "--card-foreground": text,
    "--popover": "#ffffff",
    "--popover-foreground": text,
    "--primary": primary,
    "--primary-foreground": "#ffffff",
    "--secondary": tint(secondary, 0.12),
    "--secondary-foreground": primary,
    "--muted": tint(primary, 0.06),
    "--muted-foreground": mix(text, "#ffffff", 0.35),
    "--accent": tint(secondary, 0.16),
    "--accent-foreground": primary,
    "--border": tint(primary, 0.12),
    "--input": tint(primary, 0.18),
    "--ring": secondary,
    "--sky": secondary,
    "--sky-foreground": "#ffffff",
    "--chart-1": primary,
    "--chart-2": secondary,
    "--chart-3": accent,
    "--chart-4": tint(secondary, 0.55),
    "--chart-5": shade(secondary, 0.3),
    "--chart-6": tint(primary, 0.45),
    "--chart-7": shade(accent, 0.25),
    "--chart-8": tint(accent, 0.5),
    "--sidebar": primary,
    "--sidebar-foreground": tint(primary, 0.75),
    "--sidebar-primary": secondary,
    "--sidebar-primary-foreground": "#ffffff",
    "--sidebar-accent": "rgba(255, 255, 255, 0.08)",
    "--sidebar-accent-foreground": "#ffffff",
    "--sidebar-border": "rgba(255, 255, 255, 0.12)",
    "--sidebar-ring": secondary,
    "--tenant-primary": primary,
    "--tenant-secondary": secondary,
    "--tenant-accent": accent,
    "--tenant-bg": bg,
    "--tenant-text": text,
    "--tenant-muted": tint(primary, 0.06),
  };
}

/**
 * Resolve the theme for a tenant: hand-tuned preset first, then a theme
 * derived from the tenant's stored colors. Returns null when there is no
 * tenant (login page, super_admin) so the globals.css defaults apply.
 */
export function resolveTenantTheme(tenant: Tenant | null): TenantTheme | null {
  if (!tenant) return null;
  return TENANT_THEME_PRESETS[tenant.slug] ?? deriveTheme(tenant);
}

/** Serialize a theme into a `:root { … }` rule for a <style> tag. */
export function themeToCss(theme: TenantTheme): string {
  const vars = Object.entries(theme)
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ");
  return `:root { ${vars} }`;
}

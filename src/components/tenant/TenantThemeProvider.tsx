import type { Tenant } from "@/lib/types";
import { resolveTenantTheme, themeToCss } from "@/lib/tenant-theme";

/**
 * Injects the active tenant's theme as CSS variables on :root. Rendered by
 * the authenticated app layout only, so the shared login page keeps the
 * neutral globals.css defaults. A <style> tag (rather than inline styles on
 * a wrapper) makes the variables reach portaled UI — dialogs, popovers,
 * toasts — which mount on <body>, outside any layout wrapper.
 */
export function TenantThemeProvider({ tenant }: { tenant: Tenant | null }) {
  const theme = resolveTenantTheme(tenant);
  if (!theme) return null;
  return <style id="tenant-theme">{themeToCss(theme)}</style>;
}

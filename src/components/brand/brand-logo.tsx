import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Employee Atlas product brand marks.
 *
 * Brand hierarchy in this multi-tenant app:
 * - Tenant-neutral surfaces (login, browser/OS chrome) use `color` — the
 *   product speaks at full strength because no customer owns the screen yet.
 * - Tenant-themed surfaces (app shell) use `navy` on light and `white` on
 *   dark. A monochrome mark co-exists with any tenant palette instead of
 *   competing with it; the full-colour mark would clash with e.g. Turkcell's
 *   blue/yellow.
 *
 * Source files carry different intrinsic sizes per tone, so each is declared
 * explicitly — passing the wrong ratio to next/image would distort the mark.
 */

type Tone = "color" | "navy" | "white";

type Asset = { src: string; width: number; height: number };

const ICON: Record<Tone, Asset> = {
  color: {
    src: "/logo-assets/employee-atlas-icon-color-transparent.png",
    width: 300,
    height: 290,
  },
  navy: {
    src: "/logo-assets/employee-atlas-icon-navy-transparent.png",
    width: 300,
    height: 290,
  },
  white: {
    src: "/logo-assets/employee-atlas-icon-white-transparent.png",
    width: 300,
    height: 290,
  },
};

const LOCKUP: Record<Tone, Asset> = {
  color: {
    src: "/logo-assets/employee-atlas-logo-horizontal-color-transparent.png",
    width: 400,
    height: 103,
  },
  navy: {
    src: "/logo-assets/employee-atlas-logo-horizontal-navy-transparent.png",
    width: 363,
    height: 103,
  },
  white: {
    src: "/logo-assets/employee-atlas-logo-horizontal-white-transparent.png",
    width: 363,
    height: 103,
  },
};

/** Icon only (globe + team + pin). Size it with a height class, e.g. `h-6 w-auto`. */
export function BrandMark({
  tone = "color",
  className,
  priority = false,
}: {
  tone?: Tone;
  className?: string;
  priority?: boolean;
}) {
  const asset = ICON[tone];
  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt="Employee Atlas"
      priority={priority}
      className={cn("h-6 w-auto", className)}
    />
  );
}

/** Horizontal lockup (icon + wordmark). Size it with a height class. */
export function BrandLockup({
  tone = "color",
  className,
  priority = false,
}: {
  tone?: Tone;
  className?: string;
  priority?: boolean;
}) {
  const asset = LOCKUP[tone];
  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt="Employee Atlas"
      priority={priority}
      className={cn("h-6 w-auto", className)}
    />
  );
}

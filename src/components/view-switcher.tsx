"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Map, LayoutGrid, List, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VIEWS = [
  { key: "map", label: "Map", icon: Map },
  { key: "cards", label: "Cards", icon: LayoutGrid },
  { key: "list", label: "List", icon: List },
  { key: "table", label: "Table", icon: Table2 },
] as const;

export type ViewKey = (typeof VIEWS)[number]["key"];

export function ViewSwitcher({ current }: { current: ViewKey }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function go(view: ViewKey) {
    if (view === current) return;
    if (view === "map") {
      router.push("/");
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set("view", view);
    router.push(`/directory?${params.toString()}`);
  }

  return (
    <div className="flex overflow-hidden rounded-lg border bg-card shadow-[0_2px_12px_color-mix(in_srgb,var(--primary)_8%,transparent)]">
      {VIEWS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => go(key)}
          aria-pressed={current === key}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 font-heading text-xs font-semibold transition-colors",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
            current === key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-secondary",
          )}
        >
          <Icon className="size-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}

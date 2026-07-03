"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { LocationWithCount } from "@/lib/types";
import { LocationSheet } from "@/components/map/location-sheet";
import { ViewSwitcher } from "@/components/view-switcher";
import { Skeleton } from "@/components/ui/skeleton";

const AtlasMap = dynamic(
  () => import("@/components/map/atlas-map").then((m) => m.AtlasMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-none" />,
  },
);

export function MapDashboard({
  locations,
}: {
  locations: LocationWithCount[];
}) {
  const [selected, setSelected] = useState<LocationWithCount | null>(null);
  const totalEmployees = locations.reduce(
    (sum, l) => sum + (l.employee_count ?? 0),
    0,
  );

  return (
    // `isolate` contains Leaflet's internal panes (z-index 200–700) and the
    // overlays below in their own stacking context, so the portaled location
    // sheet (z-50 on <body>) still paints above the map instead of behind it.
    <div className="relative isolate h-full w-full">
      <AtlasMap locations={locations} onSelect={setSelected} />

      {/* Overlay: status strip */}
      <div className="pointer-events-none absolute left-14 top-4 z-[500] flex flex-col gap-2">
        <div className="pointer-events-auto rounded-lg border bg-card/95 px-4 py-3 shadow-[0_2px_12px_color-mix(in_srgb,var(--primary)_8%,transparent)] backdrop-blur">
          <div className="eyebrow">Network overview</div>
          <div className="mt-1 flex items-baseline gap-4">
            <div>
              <span className="font-heading text-2xl font-bold text-primary tabular-nums">
                {totalEmployees}
              </span>
              <span className="ml-1.5 text-xs text-muted-foreground">
                employees
              </span>
            </div>
            <div>
              <span className="font-heading text-2xl font-bold text-primary tabular-nums">
                {locations.length}
              </span>
              <span className="ml-1.5 text-xs text-muted-foreground">
                locations
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-[500]">
        <ViewSwitcher current="map" />
      </div>

      <LocationSheet
        location={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

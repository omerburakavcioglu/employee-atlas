"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationWithCount } from "@/lib/types";

// Navy roundel pin with IATA code and employee-count badge —
// styled after airport wayfinding signage.
function pinIcon(location: LocationWithCount) {
  const count = location.employee_count ?? 0;
  return L.divIcon({
    className: "",
    html: `
      <div class="atlas-pin" role="button" aria-label="${location.name}">
        <div class="atlas-pin-body">
          <span class="atlas-pin-code">${location.code ?? ""}</span>
          <span class="atlas-pin-count">${count}</span>
        </div>
        <div class="atlas-pin-name">${location.name ?? ""}</div>
        <div class="atlas-pin-stem"></div>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 38],
  });
}

export function AtlasMap({
  locations,
  onSelect,
}: {
  locations: LocationWithCount[];
  onSelect: (l: LocationWithCount) => void;
}) {
  return (
    <>
      <style>{`
        .atlas-pin { display: flex; flex-direction: column; align-items: center; transform: translateX(-50%); cursor: pointer; }
        .atlas-pin-body {
          display: flex; align-items: center; gap: 6px;
          background: var(--primary); color: var(--primary-foreground);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 6px; padding: 4px 8px;
          box-shadow: 0 4px 14px color-mix(in srgb, var(--primary) 35%, transparent), 0 1px 3px color-mix(in srgb, var(--primary) 30%, transparent);
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
          white-space: nowrap;
        }
        .atlas-pin:hover .atlas-pin-body { transform: translateY(-2px); }
        .atlas-pin-code {
          font-family: "Century Gothic", var(--font-questrial), Futura, sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
        }
        .atlas-pin-count {
          background: var(--sky); border-radius: 4px; padding: 1px 5px;
          font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums;
        }
        .atlas-pin-name {
          margin-top: 3px; font-size: 10px; font-weight: 600; color: var(--primary);
          background: rgba(255,255,255,0.92); border-radius: 4px; padding: 1px 6px;
          box-shadow: 0 1px 4px color-mix(in srgb, var(--primary) 15%, transparent);
          white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis;
        }
        .atlas-pin-stem { width: 1.5px; height: 8px; background: var(--primary); margin-top: 1px; }
        .leaflet-container { font-family: inherit; }
      `}</style>
      <MapContainer
        center={[39.5, 35.0]}
        zoom={5}
        minZoom={3}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {locations.map((loc) =>
          loc.lat != null && loc.lng != null ? (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={pinIcon(loc)}
              eventHandlers={{ click: () => onSelect(loc) }}
            />
          ) : null,
        )}
      </MapContainer>
    </>
  );
}

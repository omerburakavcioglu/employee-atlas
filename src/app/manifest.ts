import type { MetadataRoute } from "next";

// PWA manifest. Tenant-neutral by design: the installed app is Employee
// Atlas (the product), not any one customer workspace, so it uses the
// product's own indigo (#4f46e5) rather than a tenant theme colour.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Employee Atlas",
    short_name: "Employee Atlas",
    description:
      "Workforce intelligence for multi-location companies — map-based employee discovery, directory, and analytics.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/logo-assets/employee-atlas-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-assets/employee-atlas-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-assets/employee-atlas-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo-assets/employee-atlas-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: "Offline-ready Mermaid flowchart editor with live preview and client-side export.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#050816",
    orientation: "portrait",
    categories: ["productivity", "developer", "graphics"],
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}

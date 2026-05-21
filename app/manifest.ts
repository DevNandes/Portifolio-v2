import type { MetadataRoute } from "next";

/**
 * Web App Manifest (served by Next at `/manifest.webmanifest`).
 * Makes the site installable as a PWA on mobile and desktop.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Raphael Fernandes — Software Engineer",
    short_name: "R. Fernandes",
    description:
      "Software engineer focused on automation (RPA), applied AI and full-stack development.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#04060f",
    theme_color: "#04060f",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

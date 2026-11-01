import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alvéo",
    short_name: "Alvéo",
    description: "Les outils de ton association, au même endroit.",
    start_url: "/m",
    scope: "/",
    display: "standalone",
    background_color: "#f1f5f2",
    theme_color: "#1f7a4d",
    lang: "fr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Black Mesa RP",
    short_name: "BMRP",
    description: "Black Mesa RP - A FiveM Roleplay Community",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#f97316",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["games", "entertainment"],
    shortcuts: [
      {
        name: "Forums",
        short_name: "Forums",
        description: "Community Forums",
        url: "/forums",
      },
      {
        name: "Live Map",
        short_name: "Map",
        description: "View live player positions",
        url: "/map",
      },
      {
        name: "Events",
        short_name: "Events",
        description: "Upcoming events",
        url: "/events",
      },
    ],
  };
}

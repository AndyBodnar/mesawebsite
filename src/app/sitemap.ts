import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blackmesarp.com";

  // Static pages
  const staticPages = [
    "",
    "/forums",
    "/news",
    "/store",
    "/map",
    "/characters",
    "/events",
    "/rules",
    "/tutorials",
    "/apply",
    "/tickets",
    "/gallery",
    "/suggestions",
    "/organizations",
    "/leaderboards",
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" as const : "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return staticRoutes;
}

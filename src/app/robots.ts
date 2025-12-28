import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blackmesarp.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/staff/",
          "/settings/",
          "/dispatch/",
          "/tickets/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

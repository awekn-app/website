import type { MetadataRoute } from "next";
import { SITE } from "./lib/links";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/reset-password"] },
    sitemap: `${SITE}/sitemap.xml`,
  };
}

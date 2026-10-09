import type { MetadataRoute } from "next";
import { SITE_URL, caseStudies } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    ...caseStudies().map((c) => ({ url: `${SITE_URL}/work/${c.slug}/`, priority: 0.8 })),
  ];
}

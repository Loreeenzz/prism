import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  // The current app has no public, indexable content. Add public routes here
  // when they are introduced; authenticated routes must stay out of the map.
  return []
}

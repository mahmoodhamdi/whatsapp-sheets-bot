import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "https://whatsappbot.com";

  // Static pages
  const staticPages = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/features", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/login", priority: 0.5, changeFrequency: "yearly" as const },
    { url: "/register", priority: 0.6, changeFrequency: "yearly" as const },
  ];

  // Documentation pages
  const docPages = [
    { url: "/docs", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/docs/quick-start", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/docs/installation", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/docs/configuration", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/docs/features/auto-reply", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/docs/features/sheets-sync", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/docs/features/analytics", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/docs/features/working-hours", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/docs/api/auth", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/docs/api/contacts", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/docs/api/messages", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/docs/api/rules", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/docs/api/whatsapp", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  const allPages = [...staticPages, ...docPages];

  return allPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

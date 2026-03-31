import type { MetadataRoute } from 'next';
import { listReportDates } from '@/lib/conflicts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://warwatch.world';

export default function sitemap(): MetadataRoute.Sitemap {
  const reportDates = listReportDates();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${SITE_URL}/wars`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/ai-analyst`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/reports`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/markets`, changeFrequency: 'hourly', priority: 0.8 },
  ];

  const reportRoutes: MetadataRoute.Sitemap = reportDates.map((date) => ({
    url: `${SITE_URL}/reports/${date}`,
    changeFrequency: 'never' as const,
    priority: 0.6,
    lastModified: new Date(date),
  }));

  return [...staticRoutes, ...reportRoutes];
}

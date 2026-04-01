import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://warwatch.world';
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL,                          changeFrequency: 'hourly',  priority: 1.0,  lastModified: NOW },
    { url: `${SITE_URL}/wars`,                changeFrequency: 'hourly',  priority: 0.95, lastModified: NOW },
    { url: `${SITE_URL}/country-risk`,        changeFrequency: 'weekly',  priority: 0.9,  lastModified: NOW },
    { url: `${SITE_URL}/markets`,             changeFrequency: 'hourly',  priority: 0.85, lastModified: NOW },
    { url: `${SITE_URL}/ai-analyst`,          changeFrequency: 'weekly',  priority: 0.75, lastModified: NOW },
    { url: `${SITE_URL}/privacy-policy`,      changeFrequency: 'monthly', priority: 0.3,  lastModified: NOW },
    { url: `${SITE_URL}/terms`,               changeFrequency: 'monthly', priority: 0.3,  lastModified: NOW },
    { url: `${SITE_URL}/editorial-policy`,    changeFrequency: 'monthly', priority: 0.3,  lastModified: NOW },
    { url: `${SITE_URL}/monetization-policy`, changeFrequency: 'monthly', priority: 0.3,  lastModified: NOW },
  ];
}
